const express = require('express')
const router = require('./routes')
const server = express()
const bodyparser = require('body-parser')

const { app, wallet } = require('./services/swapApp')

app.ready = false
app.on('ready', () => {
  console.log('swapApp ready')
  app.ready = true

  console.log('btc', wallet.btc.getAddress())
  console.log('eth', wallet.eth.address)
})


server.use(bodyparser.json())
server.use('/', router)
server.listen(1337)

console.log('app listening on http://localhost:1337')
