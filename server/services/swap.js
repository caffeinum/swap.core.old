const { EthSwap, BtcSwap } = require('../../lib/swaps')
const { ETH2BTC, BTC2ETH, ETHTOKEN2BTC, BTC2ETHTOKEN, } = require('../../lib/flows')

const { wallet } = require('../services')
const { bitcoin, ethereum } = wallet

const ethSwap = new EthSwap({
  gasLimit: 3e6,
})

const btcSwap = new BtcSwap({
  account: wallet.btc,
  fetchUnspents: (scriptAddress) => bitcoin.fetchUnspents(scriptAddress),
  broadcastTx: (txRaw) => bitcoin.broadcastTx(txRaw),
})

// console.log('eth swap', ethSwap)
// console.log('btc swap', btcSwap)

const fetchBalanceBtc = () => bitcoin.fetchBalance(wallet.btc.getAddress())
const fetchBalanceEth = () => ethereum.fetchBalance(wallet.eth.address)

const FLOW_CONFIG = (isBtc) => ({
  ethSwap,
  btcSwap,
  fetchBalance: (isBtc) ? fetchBalanceBtc : fetchBalanceEth,
})

let _swap
const start = (swap, wallet) => {
  _swap = swap

  const flow = swap.setFlow(BTC2ETH, FLOW_CONFIG)

  // swap.flow.on('state update', handleFlowStateUpdate)
  // swap.flow.on('leave step', handleLeaveStep)
  // swap.flow.on('enter step', handleEnterStep)
}

const handleFlowStateUpdate = (values) => {
  console.log('new flow state values', values)

}

const handleLeaveStep = (index) => {
  console.log('leave step', index)

}

const handleEnterStep = (index) => {
  console.log(`enter step ${index}\n\n`)

}

const signSwapFlow = (swap) => {
  swap.flow.sign()
}

const submitSecret = (swap, secret) => {
  swap.flow.submitSecret(secret)
}

module.exports = {
  FLOW_CONFIG,
  flows: { ETH2BTC, BTC2ETH, ETHTOKEN2BTC, BTC2ETHTOKEN, },
  swaps: { ethSwap, btcSwap, },
  start,
  signSwapFlow,
  submitSecret,
}
