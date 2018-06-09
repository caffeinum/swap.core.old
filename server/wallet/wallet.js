const swaps = require('./swaps')

const bitcoin = require('./bitcoin')
const ethereum = require('./ethereum')

const bjs = bitcoin.core
const web3 = ethereum.core
const network = bitcoin.core.networks.testnet

class Wallet {
  constructor(localStorage) {
    this.ethereum = ethereum
    this.bitcoin = bitcoin

    let ethPrivateKey = localStorage.getItem('ethPrivateKey')
    let btcPrivateKey = localStorage.getItem('btcPrivateKey')

    if (!ethPrivateKey)
      ethPrivateKey = ethereum.core.eth.accounts.create().privateKey

    if(!btcPrivateKey)
      btcPrivateKey = bitcoin.core.ECPair.makeRandom({ network }).toWIF()

    this.eth = ethereum.core.eth.accounts.wallet.add(ethPrivateKey)
    this.btc = new bitcoin.core.ECPair.fromWIF(btcPrivateKey, network)

    localStorage.setItem('ethPrivateKey', ethPrivateKey)
    localStorage.setItem('btcPrivateKey', btcPrivateKey)

    this.auth = {
      eth: ethPrivateKey,
      btc: btcPrivateKey
    }

    let ethData = {
      address:    this.eth.address,
      publicKey:  this.eth.publicKey,
    }

    let btcData = {
      address:    this.btc.getAddress(),
      publicKey:  this.btc.getPublicKeyBuffer().toString('hex'),
    }

    this.config = {
      eth: ethData,
      btc: btcData,
    }
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
    let ethBalance = ethereum.fetchBalance(this.eth.address)
    let btcBalance = bitcoin.fetchBalance(this.btc.getAddress())

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
    // const { config, ethData, btcData } = this
    return this.config
  }
}

// const wallet = new Wallet()

module.exports = Wallet
