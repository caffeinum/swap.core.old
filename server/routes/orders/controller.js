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

const createOrder = (req, res) => {
  try {
    const data = req.body

    let example = {
      buyCurrency: 'ETH',
      sellCurrency: 'BTC',
      buyAmount: 1,
      sellAmount: 0.1,
    }

    app.createOrder(data)
    console.log('new order', data)

    res.status(201).json(data)
  } catch (err) {
    res.status(400).send('cant create ' + err)
  }
}

const deleteOrder = (req, res) => {
  try {
    findOrder(app)(req, res, (order) => {
      app.removeOrder(order.id)
      res.status(200).json(order)
    })
  } catch (err) {
    res.status(400).send('cant delete ' + err)
  }
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
  createOrder,
  deleteOrder,
  acceptSwap,
  startSwap,
  signSwap,
  submitSwapSecret,
}
