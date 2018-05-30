const Ipfs = require('ipfs')
const IpfsRoom = require('ipfs-pubsub-room')

const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./storage')

const wallet = require('../wallet')

module.exports = {
  Ipfs, IpfsRoom,
  localStorage,
  wallet,
  bitcoinJs: wallet.bitcoin.core,
  web3: wallet.ethereum.core,
}
