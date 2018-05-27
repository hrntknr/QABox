import React from 'react'
import {Link} from 'react-router-dom'
import Web3 from 'web3'
import config from './config.json'
import css from './posts.css'

export default class Posts extends React.Component {
  constructor(...props) {
    super(...props)
    this.state = {
      error: null,
      contract: null,
      account: null,
      posts: {},
      etherscan: null,
    }
    this.post = this.post.bind(this)
    this.postMessage = React.createRef()

    web3 = new Web3(web3.currentProvider)
    web3.eth.net.getId().then((networkId)=>{
      if (! config.contractAddr[networkId]) {
        this.setState({error: 'このネットワークには対応していません。'})
        return
      }
      switch (networkId) {
      case 1:
        this.setState({etherscan: 'https://etherscan.io/'})
        break
      case 3:
        this.setState({etherscan: 'https://ropsten.etherscan.io/'})
        break
      case 4:
        this.setState({etherscan: 'https://rinkeby.etherscan.io/'})
        break
      case 42:
        this.setState({etherscan: 'https://kovan.etherscan.io/'})
        break
      }
      const contract = new web3.eth.Contract(config.abi, config.contractAddr[networkId])
      this.setState({contract})
      contract.methods.getQuestionsLength().call().then((lengthStr)=>{
        const length = Number(lengthStr)
        if (!Number.isSafeInteger(length)) {
          console.error('length is not safeinteger')
          return
        }
        [...Array(length)]
          .map((_, index)=>index)
          .reverse()
          .reduce((promise, index)=>{
            return promise.then(()=>{
              const _post = {}
              return contract.methods.getQuestions(index).call()
                .then((result)=>{
                  _post.question = result.question
                  _post.answer = result.answer
                  this.setState({posts: Object.assign({}, this.state.posts, {[index]: _post})})
                })
            })
          }, Promise.resolve())
      })
    })

    const getAccounts = ()=>{
      web3.eth.getAccounts().then((accounts)=>{
        if (this.state.account != accounts[0]) {
          console.log(`account changed: ${accounts[0]}`)
          this.setState({account: accounts[0]})
        }
        setTimeout(getAccounts, 100)
      })
    }
    getAccounts()
  }

  post() {
    if (!this.state.account) return alert('please unlock account.')
    const message = this.postMessage.current.value
    this.state.contract.methods.postQuestion(message).send({
      from: this.state.account,
    })
  }

  render() {
    if (this.state.error) {
      return <div>
        <p>{this.state.error}</p>
      </div>
    } else {
      return <div>
        <div className={css.postMessage}>
          <textarea ref={this.postMessage} cols="30" rows="10" className={css.post}></textarea>
          <button onClick={this.post}>質問する</button>
        </div>
        <h2 className={css.h2}>過去の質問</h2>
        <div className={css.pastPosts}>
          {Object.keys(this.state.posts).reverse().map((postID)=>
            <div key={postID} className={css.pastPost}>
              <Link to={`/posts/${postID}`}>
                <div className={`${css.question} ${css.post}`}>
                  <pre>
                    {this.state.posts[postID].question}
                  </pre>
                </div>
              </Link>
              {(()=>{
                if (this.state.posts[postID].answer) {
                  return <div className={css.answer}>
                    <pre>
                      {this.state.posts[postID].answer}
                    </pre>
                  </div>
                } else {
                  return <div>
                    <p>まだ回答がありません</p>
                  </div>
                }
              })()}
            </div>
          )}
        </div>
      </div>
    }
  }
}
