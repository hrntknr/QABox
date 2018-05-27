import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom'
import Post from './post.jsx'
import Posts from './posts.jsx'
import Web3Notfound from './web3Notfound.jsx'


class Redirector extends React.Component {
  constructor(...props) {
    super(...props)
    this.state = {
      web3exists: ('web3' in window),
    }
  }

  render() {
    return (() => {
      if (this.state.web3exists) {
        return <Redirect to='/posts' />
      } else {
        return <Redirect to='/web3Notfound' />
      }
    })()
  }
}

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path='/posts/:id' component={Post} exact />
      <Route path='/posts' component={Posts} exact />
      <Route path='/web3Notfound' component={Web3Notfound} />
      <Route component={Redirector} />
    </Switch>
  </HashRouter>,
  document.getElementById('app')
)
