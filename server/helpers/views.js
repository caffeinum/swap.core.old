const flows = require('swap.flows')

const status = (order) => !order ? null : {
  id: order.id,
  accepted: order.accepted,
  isResolved: order.isProcessing,
  isRequested: order.isRequested,
  status: order.status,
}

const sendStatus = (req, res) => (order) => res.json(status(order))

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
    owner,
  } = order

  return {
    id, isMy, swap, string: orderToString(order),
    buyAmount, buyCurrency, sellAmount, sellCurrency,
    isRequested, isProcessing, isAccepted,
    participant, requests,
    owner,
  }
}

module.exports = {
  orderToString,
  swapToString,
  swapView,
  orderView,
}
