const { setupEnv, SwapApp } = require('./lib')

const Ipfs = require('ipfs')
const IpfsRoom = require('ipfs-pubsub-room')
const bitcoinJs = require('bitcoinjs-lib')
const web3 = require('web3')

const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./storage')

const env = { Ipfs, IpfsRoom, bitcoinJs, web3, localStorage }
setupEnv(env)

const app = new SwapApp({
  me: {
    reputation: 10,
    eth: {
     address: '0x0',
     publicKey: '0x0',
    },
    btc: {
     address: '0x0',
     publicKey: '0x0',
    },
  },
  config: {
    ipfs: {
      swarm: [
        '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star',
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
})

app.on('ready', () => {
  console.log('swapApp ready')

  main()
})

app.on('user online', (peer) => {
  console.log('user online', peer)
})

app.on('user offline', (peer) => {
  console.log('user offline', peer)
})

app.on('new swap', (swap) => {
  console.log('new swap', swap)
})

app.on('new swap request', ({ swapId, participant }) => {
  console.error(`user ${participant.peer} requesting swap`, {
    swap: app.swapCollection.getByKey(swapId),
    participant,
  })
})

function main() {
  let swaps = app.getOrders()

  console.log('swaps', app.getOrders())

  // const data = {
  //   buyCurrency: 'ETH',
  //   sellCurrency: 'BTC',
  //   buyAmount: 1,
  //   sellAmount: 0.1,
  // }
  //
  // app.createOrder(data)
  //
  // app.createSwap(0)

  console.log('swaps', app.getOrders())

}
