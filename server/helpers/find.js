const Swap = require('swap.swap').default
const flows = require('swap.flows')

const { orderView } = require('./views')

const decodeFlow = (swap) => {
  const { isMy: isMyOrder, buyCurrency, sellCurrency } = swap

  const firstPart     = isMyOrder ? sellCurrency : buyCurrency
  const lastPart      = isMyOrder ? buyCurrency : sellCurrency
  const flowName = `${firstPart.toUpperCase()}2${lastPart.toUpperCase()}`

  return flows[flowName]
}

const findOrder = (app) => (req, res, next) => {
  orders = app.services.orders.items

  let id = req.params.id

  console.log('id', id)
  let order = app.services.orders.getByKey(id)
  if (!order) return res.status(404).json({ error: 'no such order' })

  next && next(order)

  return order
}

const findSwap = (app) => (req, res, next) => {

  let id = req.params.id

  console.log('id', id)

  const swap = new Swap(id)
  next && next(swap)
}

module.exports = {
  decodeFlow,
  findSwap,
  findOrder,
}
