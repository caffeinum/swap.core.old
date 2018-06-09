const { findSwap, swapView, decodeFlow } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')

const SECRET = 'c0809ce9f484fdcdfb2d5aabd609768ce0374ee97a1a5618ce4cd3f16c00a078'

const getSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    if ( swap.flow && swap.flow.step )
      return res.json(swapView(swap))

    const flow = swap.flow

    res.json(swapView(swap))
  })
}

const goSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    if ( swap.flow && swap.flow.step )
      return res.json(swapView(swap))

    const flow = swap.flow
    const name = decodeFlow(swap)

    console.log('flow', flow)
    console.log('flow name', name)

    if ( name == "BTC2ETH" ) {

      swap.on('enter step', (step) => {
        if ( step == 1 ) swap.flow.submitSecret(SECRET)
      })

    } else if ( name == "ETH2BTC" ) {
      swap.flow.sign()

      swap.on('enter step', (step) => {
        console.log('enter step', step)
        if ( step == 2 ) swap.flow.verifyBtcScript()
      })
    }

    // swap.flow.syncBalance()

    console.log('swap', swap)

    res.json(swapView(swap))
  })
}

module.exports = {
  getSwap,
  goSwap,
}
