const { status, sendStatus, findOrder, orderView } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')

let _order, _status, _swap

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

const requestedOrders = (req, res) => {
  let orders = app.getMyOrders()

  orders = orders.filter( ({ requests }) => requests.length )
  orders = orders.map(orderView)

  res.json(orders)
}

const getOrder = (req, res) => {
  findOrder(app)(req, res, (order) => res.json(orderView(order)))
}

const createOrder = (req, res) => {
  try {
    const { buyCurrency, sellCurrency, buyAmount, sellAmount, } = req.body
    const data = { buyCurrency, sellCurrency,  buyAmount, sellAmount, }

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
      res.status(200).end()
    })
  } catch (err) {
    res.status(400).send('cant delete ' + err)
  }
}

const deleteAllOrders = (req, res) => {
  try {
    app.getMyOrders().map( order => {
      app.removeOrder(order.id)

    })

    res.status(200).end()
  } catch (err) {
    res.status(400).send('cant delete ' + err)
  }
}

const requestOrder = (req, res) => {
  findOrder(app)(req, res, (order) => {
    order.sendRequest( accepted => {
      order.isAccepted = accepted
      if (!accepted) return

      const swap = app.createSwap({ orderId: order.id })

      console.log('peer accepted order', orderView(order))
      console.log('swap', swap)

      _swap = swap
    })

    order.swap = `/swaps/${order.id}/go`
    res.json(orderView(order))
  })
}

const acceptRequest = (req, res) => {
  findOrder(app)(req, res, (order) => {
    let peer = req.params.peer

    if (order.requests.length == 1)
      peer = order.requests[0].peer

    if (!peer)
      return res.status(404).send('no peer')

    order.acceptRequest(peer)

    console.log('peer', peer)
    console.log('accepting order', orderView(order))

    const swap = app.createSwap({ orderId: order.id })
    console.log('swap', swap)

    _swap = swap

    order.swap = `/swaps/${order.id}/go`

    res.json(orderView(order))
  })
}

module.exports = {
  filterOrders,
  listOrders,
  requestedOrders,

  getOrder,
  createOrder,
  deleteOrder,
  deleteAllOrders,

  requestOrder,
  acceptRequest,
}
