const swapApp = require('swap.app').default
const config = require('./services/config')

swapApp.setup(config)

module.exports = swapApp
