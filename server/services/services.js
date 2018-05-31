const Ipfs = require('ipfs')
const IpfsRoom = require('ipfs-pubsub-room')

const id = require('./id')
console.log('[WALLET] use id =', id)

const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./storage/' + id)

const Wallet = require('../wallet')
const wallet = new Wallet(localStorage)

module.exports = {
  Ipfs, IpfsRoom,
  localStorage,
  wallet,
  bitcoinJs: wallet.bitcoin.core,
  web3: wallet.ethereum.core,
}
