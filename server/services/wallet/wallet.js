const { bitcoin, ethereum } = require('../instances')

const SwapAuth = require('swap.auth')

const bjs = bitcoin.core
const web3 = ethereum.core
const network = bitcoin.core.networks.testnet

class Wallet {
  constructor() {
    this.ethereum = ethereum
    this.bitcoin = bitcoin
    this.config = {}

    this.auth = new SwapAuth({
      eth: null,
      btc: null,
    })
  }

  async withdraw(from, to, value) {
    switch (from) {
      // case 'btc':
      //   return bitcoin.sendTransaction({ account: this.btc, to, value})
      case 'eth':
        return ethereum.sendTransaction({to, value})
      default:
        return Promise.reject('not implemented')
    }
  }

  async getBalance() {
    let ethBalance = ethereum.fetchBalance(this.auth.accounts.eth.address)
    let btcBalance = bitcoin.fetchBalance(this.auth.accounts.btc.getAddress())

    let [ eth, btc ] = await Promise.all([ ethBalance, btcBalance ])

    return { eth, btc }
  }

  getCore() {
    return {
      eth: ethereum.core,
      btc: bitcoin.core,
    }
  }

  view() {
    return {
      etherscan: `https://rinkeby.etherscan.io/address/${this.auth.accounts.eth.address}`,
      blockchain: `https://testnet.blockchain.info/address/${this.auth.accounts.btc.getAddress()}`,
      ...this.auth.getPublicData()
    }
  }

}

module.exports = new Wallet()
