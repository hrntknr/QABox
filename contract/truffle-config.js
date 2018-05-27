const HDWalletProvider = require('truffle-hdwallet-provider')

console.log(`MNEMONIC: ${process.env.MNEMONIC}`)

module.exports = {
  networks: {
    ropsten: {
      provider: new HDWalletProvider(process.env.MNEMONIC, 'https://ropsten.infura.io/'),
      network_id: 3,
    },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 2000000,
    },
  },
}
