const { setupEnv, SwapApp } = require('../../lib')

const env = require('./services')
const wallet = env.wallet

const id = require('./id');

const config = {
  ipfs: {
    repo: '.ipfs/' + id,
    EXPERIMENTAL: { pubsub: true, },
    config: {
      Addresses: {
        Swarm: [ '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star' ]
      }
    }
  }
}

setupEnv(env)

const app = new SwapApp({ me: wallet.config, config })
console.log('created swap app, me:', wallet.config)

module.exports = { app, wallet }
