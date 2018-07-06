const { ipfs, ipfs_room, ipfs_config } = require('./ipfs')
const { bitcoin, ethereum } = require('./instances')

const storage = require('./local_storage')
const wallet = require('./wallet')

const SwapRoom = require('swap.room')
const SwapOrders = require('swap.orders')

const { constants: { COINS } } = require('swap.app')
const { ETH2BTC, BTC2ETH, ETHTOKEN2BTC, BTC2ETHTOKEN } = require('swap.flows')

// -- services --

const auth = wallet.auth

const room = new SwapRoom(ipfs_config)

const orders = new SwapOrders()

// -- swaps --

const swaps = require('./swaps')

module.exports = {
  network: 'testnet',
  env: {
    Ipfs: ipfs, IpfsRoom: ipfs_room,
    storage,
    bitcoin: bitcoin.core,
    web3: ethereum.core,
  },
  services: [
    auth,
    room,
    orders,
  ],
  swaps,
  flows: [
    ETH2BTC,
    BTC2ETH,
    ETHTOKEN2BTC(COINS.noxon),
    BTC2ETHTOKEN(COINS.noxon),
  ],
}
