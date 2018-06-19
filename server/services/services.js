const Ipfs = require('ipfs')
const IpfsRoom = require('ipfs-pubsub-room')

const id = require('./id')
console.log('[WALLET] use id =', id)

const Storage = require('./storage')
const storage = new Storage('./storage/' + id)

const { Wallet, Swaps } = require('../wallet')
const wallet = new Wallet()

const SwapAuth = require('swap.auth')
const SwapRoom = require('swap.room')
const SwapOrders = require('swap.orders')

const ipfs_config = {
  repo: '.ipfs/' + id,
  EXPERIMENTAL: { pubsub: true, },
  config: {
    Addresses: {
      Swarm: [ '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star' ]
    }
  }
}

module.exports = {
  wallet,
  env: {
    Ipfs, IpfsRoom,
    storage,
    bitcoin: wallet.bitcoin.core,
    web3: wallet.ethereum.core,
  },
  services: [
    wallet.auth,
    new SwapRoom(ipfs_config),
    new SwapOrders(),
  ],
  swaps: Swaps,
}
