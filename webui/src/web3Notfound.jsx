import React from 'react'
import css from './web3Notfound.css'

export default class Post extends React.Component {
  render() {
    return <div className={css.main}>
      <h1 className={css.title}>Web3 Providerが見つかりません</h1>
      <p>
        <a href="https://metamask.io/">https://metamask.io/</a>
      </p>
      <p>
        <a href="https://status.im/">https://status.im/</a>
      </p>
    </div>
  }
}
