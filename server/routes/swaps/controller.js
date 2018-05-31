const { findSwap, swapView } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')

const getSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    res.json(swapView(swap))
  })
}

module.exports = {
  getSwap,
}
