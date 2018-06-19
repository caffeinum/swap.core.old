const swapApp = require('swap.app').default

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

console.log('created swap app, me:', wallet.view())

module.exports = { app, wallet }
