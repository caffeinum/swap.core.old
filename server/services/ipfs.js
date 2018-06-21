const ipfs = require('ipfs')
const ipfs_room = require('ipfs-pubsub-room')

const id = require('./id')
console.log('[IPFS] use id =', id)

const ipfs_config = {
  repo: '.ipfs/' + id,
  EXPERIMENTAL: { pubsub: true, },
  config: {
    Addresses: {
      Swarm: [ '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star' ]
    }
  }
}

module.exports = {
  ipfs,
  ipfs_room,
  ipfs_config,
}
