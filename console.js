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

let orders = []

console.log('\033[2J');

const app = new SwapApp({
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
          '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star',
        ]
      }
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
  console.log('new orders')
})

app.on('new order', (swap) => {
  console.log('new order')
})

app.on('remove order', (swap) => {
  console.log('remove order')
})

app.on('new order request', ({ swapId, participant }) => {
  console.error(`user ${participant.peer} requesting swap`, {
    swap: app.orderCollection.getByKey(swapId),
    participant,
  })
})

const swapToString = (swap) => [
  swap.id,
  ( swap.isMy ? 'my' : '- ' ),
  swap.buyAmount, swap.buyCurrency.padEnd(10),
  '→',
  swap.sellAmount, swap.sellCurrency.padEnd(10)
].join(' ')

const updateOrders = () => {
  orders = app.getOrders()

  console.log('[SWAPS]:')
  console.log('––––––––––––––––')
  console.log(orders.map(swapToString).join('\n'))
  console.log('––––––––––––––––')
}

app.on('new orders', updateOrders)
app.on('new order', updateOrders)
app.on('remove order', updateOrders)
app.on('swap update', updateOrders)

function main() {

}
