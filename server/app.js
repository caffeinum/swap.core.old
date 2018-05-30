const express = require('express')
const router = require('./routes')
const server = express()

const { app, wallet } = require('./services/swapApp')

app.on('ready', () => {
  console.log('swapApp ready')

  console.log('btc', wallet.btc.getAddress())
  console.log('eth', wallet.eth.address)
})

server.use('/', router)
server.listen(1337)

console.log('app listening on http://localhost:1337')
