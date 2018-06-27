const ipfs = require('ipfs')
const ipfs_room = require('ipfs-pubsub-room')

const id = require('./id')
console.log('[IPFS] use id =', id)

const ipfs_config = {
  repo: '.ipfs/' + id,
  EXPERIMENTAL: { pubsub: true, },
  config: {
    Addresses: {
      Swarm: [
        // '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
        '/dns4/star.wpmix.net/tcp/443/wss/p2p-websocket-star',
      ]
    }
  }
}

module.exports = {
  ipfs,
  ipfs_room,
  ipfs_config,
}
