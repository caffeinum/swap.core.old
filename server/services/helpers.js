const status = (order) => !order ? null : {
  id: order.id,
  accepted: order.accepted,
  isResolved: order.isProcessing,
  isRequested: order.isRequested,
  status: order.status,
}

const sendStatus = (req, res) => (order) => res.json(status(order))

const findOrder = (app) => (req, res, next) => {
  orders = app.getOrders()

  let id = req.params.id

  console.log('id', id)
  let order = app.orderCollection.getByKey(id)
  if (!order) return res.status(404).send('no such order')

  next && next(order)

  return order
}

const swapToString = (swap, full) => {
  try {
    let link = `<a href="/orders/${swap.id}/start">start</a>`
    return [
      full ? link : '',
      swap.id.split('-').pop(),
      ( swap.isMy ? 'my' : '- ' ),
      swap.buyAmount.toString().padStart('10'), swap.buyCurrency.padEnd(10),
      '→',
      swap.sellAmount.toString().padStart('10'), swap.sellCurrency.padEnd(10),
      'REP', swap.owner.reputation,
      '[', swap.owner.peer.slice(0,5), '...', swap.owner.peer.slice(-10), ']'
    ].join(' ')
  } catch (e) {
    return ''
  }
}

const orderView = (order) => {
  if (!order) return {}

  let {
    id, isMy,
    buyAmount, buyCurrency, sellAmount, sellCurrency,
    owner: { peer, reputation }
  } = order

  return {
    id, isMy,
    buyAmount, buyCurrency, sellAmount, sellCurrency,
    owner: { peer, reputation }
  }
}


module.exports = {
  status,
  sendStatus,
  findOrder,
  swapToString,
  orderView,
}
