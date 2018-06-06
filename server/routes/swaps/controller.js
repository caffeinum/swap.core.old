const { findSwap, swapView, decodeFlow } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')

const { flows, FLOW_CONFIG } = require('../../services/swap')

const SECRET = 'c0809ce9f484fdcdfb2d5aabd609768ce0374ee97a1a5618ce4cd3f16c00a078'

const getSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    const name = decodeFlow(swap)
    const flow = swap.setFlow(flows[name], FLOW_CONFIG(swap.sellCurrency == "btc"))

    res.json(swapView(swap))
  })
}

const goSwap = (req, res) => {
  findSwap(app)(req, res, async (swap) => {
    if ( swap.flow && swap.flow.step )
      return res.json(swapView(swap))

    console.log('swap', swap)

    const name = decodeFlow(swap)

    console.log('flow name', name)
    const flow = swap.setFlow(flows[name], FLOW_CONFIG(swap.sellCurrency == "btc"))

    console.log('flow', flow)
    res.json(swapView(swap))

    if ( name == "BTC2ETH" ) {
      await flow.enterStep(1)
      flow.submitSecret(SECRET)

      await flow.enterStep(3)
      console.error('checking balance')

    } else if ( name == "ETH2BTC" ) {
      flow.sign()

      await flow.enterStep(2)
      flow.verifyBtcScript()
    }

  })
}

module.exports = {
  getSwap,
  goSwap,
}
