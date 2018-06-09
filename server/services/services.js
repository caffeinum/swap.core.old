const Ipfs = require('ipfs')
const IpfsRoom = require('ipfs-pubsub-room')

const id = require('./id')
console.log('[WALLET] use id =', id)

const LocalStorage = require('node-localstorage').LocalStorage
const storage = new LocalStorage('./storage/' + id)

const { Wallet, Swaps } = require('../wallet')
const wallet = new Wallet(storage)

const SwapAuth = require('../../lib/services/swap.auth').default
const SwapRoom = require('../../lib/services/swap.room').default
const SwapOrders = require('../../lib/services/swap.orders').default

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
    new SwapAuth(wallet.auth),
    new SwapRoom(ipfs_config),
    new SwapOrders(),
  ],
  swaps: Swaps,
}
