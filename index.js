require('app-module-path').addPath(__dirname + '/lib')

const Swap = require('swap.swap')

const auth = require('swap.auth')
const room = require('swap.room')
const orders = require('swap.orders')

const swaps = require('swap.swaps')
const flows = require('swap.flows')

const app = require('swap.app')

const swap = {
  app,
  swaps,
  flows,
  auth,
  room,
  orders,
  swap: Swap,
}

module.exports = swap
