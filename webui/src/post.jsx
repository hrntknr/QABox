import React from 'react'
import Web3 from 'web3'
import config from './config.json'
import css from './post.css'

export default class Posts extends React.Component {
  constructor(...props) {
    super(...props)
    this.state = {
      error: null,
      contract: null,
      account: null,
      owner: null,
      etherscan: null,
      question: '',
      answer: '',
      from: '',
      txID: '',
      postID: null,
    }
    this.answer = this.answer.bind(this)
    this.answerMessage = React.createRef()

    web3 = new Web3(web3.currentProvider)
    web3.eth.net.getId().then((networkId)=>{
      if (! networkId in config.contractAddr) {
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
      contract.methods.owner().call().then((owner)=>{
        this.setState({owner})
      })
      const postID = Number(this.props.match.params.id)
      this.setState({postID})
      if (!Number.isSafeInteger(postID)) {
        console.error('postID is not safeinteger')
        return
      }
      contract.methods.getQuestions(postID).call().then((result)=>{
        this.setState({
          question: result.question,
          answer: result.answer,
        })
        return contract.getPastEvents('QuestionPosted', {
          filter: {postID},
          fromBlock: 0,
        })
      }).then(((result)=>{
        this.setState({
          from: result[0].address,
          txID: result[0].transactionHash,
        })
      }))
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

  answer() {
    if (!this.state.account) return alert('please unlock account.')
    const message = this.answerMessage.current.value
    this.state.contract.methods.answerQuestion(this.state.postID, message).send({
      from: this.state.account,
    })
  }

  render() {
    return <div className={css.main}>
      <div className={`${css.question} ${css.post}`}>
        <pre>{this.state.question}</pre>
      </div>
      {(()=>{
        if (this.state.answer) {
          return <div className={css.answer}>
            <pre>
              {this.state.answer}
            </pre>
          </div>
        } else {
          return <div>
            <p>まだ回答がありません</p>
            {(()=>{
              if (
                this.state.account && this.state.owner &&
                this.state.account.toLowerCase() == this.state.owner.toLowerCase()
              ) {
                return <div className={css.answerForm}>
                  <textarea ref={this.answerMessage} cols="30" rows="10"></textarea>
                  <button onClick={this.answer}>回答する</button>
                </div>
              }
            })()}
          </div>
        }
      })()}
      <div className={css.pastPost_info}>
        <p>from: {this.state.from}</p>
        <a href={this.state.etherscan
          ? `${this.state.etherscan}tx/${this.state.txID}`
          : null}>etherscan</a>
      </div>
    </div>
  }
}
