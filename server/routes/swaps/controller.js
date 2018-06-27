const app = require('../../swapApp')
const { findSwap, swapView, decodeFlow, removeSwap } = require('../../helpers')

const flows = require('swap.flows')
const Swap = require('swap.swap').default

const SECRET = 'c0809ce9f484fdcdfb2d5aabd609768ce0374ee97a1a5618ce4cd3f16c00a078'

const getSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    res.json(swapView(swap))
  })
}

const resetSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    if ( !swap.flow )
      return res.status(404).json({ error: 'no swap' })

    removeSwap(swap)
  })
}

const goSwap = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    if ( swap.flow && swap.flow.state.step )
      return res.json(swapView(swap))

    if ( swap.flow instanceof flows["BTC2ETH"] ) {
      swap.type = "BTC2ETH"

      swap.on('enter step', (step) => {
        console.log('enter step', step)

        if ( step == 1 ) swap.flow.submitSecret(SECRET)

        if ( step + 1 === swap.flow.steps.length ) {
          // removeSwap(swap)
        }
      })

    } else if ( swap.flow instanceof flows["ETH2BTC"] ) {
      swap.type = "ETH2BTC"

      swap.on('enter step', (step) => {
        console.log('enter step', step)

        if ( step == 1 ) swap.flow.sign()

        if ( step == 2 ) swap.flow.verifyBtcScript()


        if ( step + 1 === swap.flow.steps.length ) {
          // removeSwap(swap)
        }
      })

    }

    res.json(swapView(swap))
  })
}


const step = (req, res) => {
  findSwap(app)(req, res, (swap) => {
    if ( !swap.flow || !swap.flow.state || !swap.flow.state.step )
      return res.status(403).json({ error: 'not started' })

    const current = swap.flow.state.step

    const steps = manualSteps[ swap.type ]

    const action = steps[current] || (() => {})

    action()

    res.json(swapView(swap))
  })
}

const refund = (req, res) => {
  // const id = req.params.id
  //
  // const Flow = decodeFlow(new Swap(id, flows["BTC2ETH"]))
  // const swap = new Swap(id, Flow)

  findSwap(app)(req, res, (swap) => {

    if ( !swap.flow || !swap.flow.state || !swap.flow.state.step )
      return res.status(403).json({ error: 'not started' })

    if ( swap.flow instanceof flows["BTC2ETH"] ) {
      const { btcScriptValues: scriptValues, secret } = swap.flow.state

      swap.flow.btcSwap.refund({ scriptValues, secret })

      res.json({ status: 'refund BTC started' })

    } else if ( swap.flow instanceof flows["ETH2BTC"] ) {
      const { participant } = swap

      swap.flow.ethSwap.refund({ participantAddress: participant.eth.address })

      res.json({ status: 'refund ETH started' })

    } else {
      res.status(404).json({ error: 'unknown flow' })
    }

  })

}

module.exports = {
  getSwap,
  goSwap,
  resetSwap,
  refund,
}
