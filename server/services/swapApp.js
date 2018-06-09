const swapApp = require('../../lib/swap.app').default

const { env, wallet, swaps, services } = require('./services')

const id = require('./id')
console.log('[SERVER] use id =', id)

const config = {
  network: 'testnet',
  env,
  services,
  swaps,
}

swapApp.setup(config)

const app = swapApp

console.log('created swap app, me:', wallet.config)

module.exports = { app, wallet }
