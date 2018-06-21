require('app-module-path').addPath(__dirname + '/lib')

const express = require('express')
const router = require('./routes')
const server = express()
const bodyparser = require('body-parser')

const { wallet } = require('./services')
const app = require('./swapApp')

app.ready = false
app.services.room.once('ready', () => {
  console.log('swapApp ready')
  app.ready = true

  console.log('btc', wallet.auth.accounts.btc.getAddress())
  console.log('eth', wallet.auth.accounts.eth.address)

  console.log('created swap app, me:', wallet.view())
})

const port = process.env.PORT || 1337
server.use(bodyparser.json())
server.use('/', router)
server.listen(port)
console.log(`[SERVER] listening on http://localhost:${port}`)

module.exports = { server, app }
