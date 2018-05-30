const { status, sendStatus, findOrder, swapToString, orderView } = require('../../services/helpers')
const { start, signSwapFlow, submitSecret } = require('../../services/swap')
const { app, wallet } = require('../../services/swapApp')

let _order, _status

const listOrders = (req, res) => {
  orders = app.getOrders().filter( order => !!order )
  orders = orders.map(orderView)

  res.json(orders)
}

const filterOrders = (req, res) => {
  let peer = req.query.peer || ''

  orders = app.getOrders().filter( order => !!order )
  orders = orders.filter( order => order.owner.peer == peer)
  orders = orders.map(orderView)

  res.json(orders)
}

const orderStatus = (req, res) => {
  findOrder(app)(req, res, sendStatus(req, res))
}

const acceptSwap = (req, res) => {
  try {
    let order = findOrder(app)(req, res)

    _order = order
    _status = { resolved: false, accepted: null }
    order.status = _status

    let accept = new Promise((resolve, reject) =>
      order.sendRequest((accepted) => {
        _status = { resolved: true, accepted }
        resolve(accepted)
      }))

    res.json({ started: true, status: status(order) })
  } catch (e) {
    res.status(500).json(e)
  }
}

const startSwap = (req, res) => {
  findOrder(app)(req, res, (order) => {
    let { eth, btc } = wallet
    console.log('order', order)

    let accept = new Promise((resolve, reject) =>
      order.sendRequest((accepted) => {
        accepted ? resolve(true) : reject(false)
      }))

    accept.then( () => {
      let swap = app.createSwap({ orderId: order.id })
      console.log('swap', swap)
      start(swap, eth, btc)
      _status.started = true
      sendStatus(req, res)(order)
    }).catch(() => res.status(500).send('not accepted'))

  })
}

const signSwap = (req, res) => {
  findOrder(app)(req, res, (order) => {
    signSwap(order)
    _status.signed = true
    sendStatus(res)
  })
}

const submitSwapSecret = (req, res) => {
  findOrder(app)(req, res, (order) => {
    submitSecret(order, secret)
    _status.submitted = true
    sendStatus(res)
  })
}

module.exports = {
  filterOrders,
  listOrders,
  orderStatus,
  acceptSwap,
  startSwap,
  signSwap,
  submitSwapSecret,
}
