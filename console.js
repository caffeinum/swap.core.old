require('dotenv').config()

const { setupEnv, SwapApp } = require('./lib')

const Ipfs = require('ipfs')
const IpfsRoom = require('ipfs-pubsub-room')
const bitcoin = require('bitcoinjs-lib')
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/JCnK5ifEPH9qcQkX0Ahl'))

const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./storage')

const ethPrivateKey = process.env.ETH_KEY || localStorage.getItem('ethPrivateKey')
const btcPrivateKey = process.env.BTC_KEY || localStorage.getItem('btcPrivateKey')

const eth = web3.eth.accounts.wallet.add(ethPrivateKey)
const btc = new bitcoin.ECPair.fromWIF(btcPrivateKey, bitcoin.networks.testnet)

localStorage.setItem('ethPrivateKey', ethPrivateKey)
localStorage.setItem('btcPrivateKey', btcPrivateKey)

const env = { Ipfs, IpfsRoom, bitcoinJs: bitcoin, web3, localStorage }
setupEnv(env)

console.log('\033[2J');

const app = global.app = new SwapApp({
  me: {
    reputation: 33,
    eth: {
      address:    eth.address,
      publicKey:  eth.publicKey,
    },
    btc: {
      address:    btc.getAddress(),
      publicKey:  btc.getPublicKeyBuffer().toString('hex'),
    },
  },
  config: {
    ipfs: {
      EXPERIMENTAL: {
        pubsub: true,
      },
      Addresses: {
        Swarm: [
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star',
        ],
      },
    }
  }
})

app.on('ready', () => {
  console.log('swapApp ready')

  console.log('btc', btc.getAddress())
  console.log('eth', eth.address)

  main()
})

app.on('user online', (peer) => {
  console.log('user online', peer)
})

app.on('user offline', (peer) => {
  console.log('user offline', peer)
})

app.on('new orders', (swaps) => {
  console.log('new orders', swaps.map(swapToString))
})

app.on('new order', (swap) => {
  console.log('new order', swapToString(swap))
})

app.on('remove order', (swap) => {
  console.log('remove order', swapToString(swap))
})

app.on('new order request', ({ swapId, participant }) => {
  console.error(`user ${participant.peer} requesting swap`, {
    swap: app.orderCollection.getByKey(swapId),
    participant,
  })
})

const swapToString = (swap) => [
  ( swap.isMy ? "my" : "-" ),
  swap.buyAmount, swap.buyCurrency,
  '-',
  swap.sellAmount, swap.sellCurrency
].join(' ')


function main() {
  let swaps = app.getOrders().map(swapToString).join('\n')

  console.log('swaps', swaps)

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

  // console.log('swaps', app.getOrders())

}
