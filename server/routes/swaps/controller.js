const { findSwap, swapView, decodeFlow, flows } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')

const SECRET = 'c0809ce9f484fdcdfb2d5aabd609768ce0374ee97a1a5618ce4cd3f16c00a078'

const getSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    res.json(swapView(swap))
  })
}

const goSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    if ( swap.flow && swap.flow.state.step )
      return res.json(swapView(swap))

    if ( swap.flow instanceof flows["BTC2ETH"] ) {

      swap.on('enter step', (step) => {
        console.log('enter step', step)
        if ( step == 1 ) swap.flow.submitSecret(SECRET)
      })

    } else if ( swap.flow instanceof flows["ETH2BTC"] ) {
      swap.on('enter step', (step) => {
        console.log('enter step', step)

        if ( step == 1 ) swap.flow.sign()

        if ( step == 2 ) swap.flow.verifyBtcScript()
      })
    }

    res.json(swapView(swap))
  })
}

module.exports = {
  getSwap,
  goSwap,
}
