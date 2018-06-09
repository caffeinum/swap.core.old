const flows = require('../../lib/swap.flows')
// const { Swap } = require('./swap')
const Swap = require('../../lib/swap.swap').default

const status = (order) => !order ? null : {
  id: order.id,
  accepted: order.accepted,
  isResolved: order.isProcessing,
  isRequested: order.isRequested,
  status: order.status,
}

const sendStatus = (req, res) => (order) => res.json(status(order))

const findOrder = (app) => (req, res, next) => {
  orders = app.services.orders.items

  let id = req.params.id

  console.log('id', id)
  let order = app.services.orders.getByKey(id)
  if (!order) return res.status(404).send('no such order')

  next && next(order)

  return order
}

const findSwap = (app) => (req, res, next) => {
  findOrder(app)(req, res, (order) => {
    console.log('order', orderView(order))
    if (!order.isProcessing) return res.status(400).end()

    const name = decodeFlow(order)
    const swap = new Swap(order.id, flows[name])

    console.log('swap', swapView(swap))
    next && next(swap)
  })
}

const swapToString = (swap) => ""

const orderToString = (swap, full) => {
  try {
    let link = `<a href="/orders/${swap.id}/start">start</a>`
    return [
      full ? link : '',
      swap.id.split('-').pop(),
      ( swap.isMy ? 'my' : '- ' ),
      swap.buyAmount, swap.buyCurrency,
      '→',
      swap.sellAmount, swap.sellCurrency,
      '[', swap.owner.peer.slice(0,5), '...', swap.owner.peer.slice(-10), ']'
    ].join(' ')
  } catch (e) {
    return ''
  }
}

const decodeFlow = (swap) => {
  const { isMy: isMyOrder, buyCurrency, sellCurrency } = swap

  const firstPart     = isMyOrder ? sellCurrency : buyCurrency
  const lastPart      = isMyOrder ? buyCurrency : sellCurrency
  const flowName = `${firstPart.toUpperCase()}2${lastPart.toUpperCase()}`

  return flowName
}

const swapView = (swap) => {
  let { flow } = swap

  return {
    flow: flow ? flow.state : null,
    ...orderView(swap)
  }
}

const orderView = (order) => {
  if (!order) return {}

  let {
    id, isMy, swap,
    buyAmount, buyCurrency, sellAmount, sellCurrency,
    isRequested, isProcessing, isAccepted,
    participant, requests,
    owner: { peer, reputation }
  } = order

  return {
    id, isMy, swap, string: orderToString(order),
    buyAmount, buyCurrency, sellAmount, sellCurrency,
    isRequested, isProcessing, isAccepted,
    participant, requests,
    owner: { peer, reputation }
  }
}

const setFlow = (swap) => {
  const ethSwap = new EthSwap({
    gasLimit: 3e6,
  })

  const btcSwap = new BtcSwap({
    account: btcAccount,
    fetchUnspents: (scriptAddress) => bitcoinInstance.fetchUnspents(scriptAddress),
    broadcastTx: (txRaw) => bitcoinInstance.broadcastTx(txRaw),
  })

  const fetchBalance = () => bitcoinInstance.fetchBalance(btcAccount.getAddress())

  const flow = swap.setFlow(BTC2ETH, {
    ethSwap,
    btcSwap,
    fetchBalance,
  })

  return flow
}

module.exports = {
  status,
  sendStatus,
  findOrder,
  findSwap,
  orderToString,
  swapToString,
  decodeFlow,
  swapView,
  orderView,
}
