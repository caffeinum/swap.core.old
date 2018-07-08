const { bitcoin, ethereum } = require('../instances')
const id = require('../id')

const SwapAuth = require('swap.auth')

const bjs = bitcoin.core
const web3 = ethereum.core
const network = bitcoin.core.networks.testnet

class Wallet {
  constructor() {
    this.ethereum = ethereum
    this.bitcoin = bitcoin
    this.config = {}
    this.id = id

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
      id: this.id,
      'etherscan.io': `https://rinkeby.etherscan.io/address/${this.auth.accounts.eth.address}`,
      'blockchain.info': `https://testnet.blockchain.info/address/${this.auth.accounts.btc.getAddress()}`,
      ...this.auth.getPublicData()
    }
  }

  async detailedView() {
    const gasPrice = await ethereum.core.eth.getGasPrice()
    const gasLimit = 3e6 // TODO sync with EthSwap.js
    const btcFee = 15000 // TODO sync with BtcSwap.js and bitcoin instance

    return {
      eth: {
        gasPrice,
        gasLimit,
        // ...ethereum.core,
      },
      btc: {
        fee: btcFee,
        // ...bitcoin.core,
      },
      wallet: this.view()
    }
  }

}

module.exports = new Wallet()
