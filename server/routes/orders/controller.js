const { status, sendStatus, findOrder, orderView } = require('../../services/helpers')
const { app, wallet } = require('../../services/swapApp')
const Orders = app.services.orders

let _order, _status, _swap

const listOrders = (req, res) => {
  orders = Orders.items.filter( order => !!order )
  orders = orders.map(orderView)

  res.json(orders)
}

const filterOrders = (req, res) => {
  let peer = req.query.peer || ''

  orders = Orders.items.filter( order => !!order )
  orders = orders.filter( order => order.owner.peer == peer)
  orders = orders.map(orderView)

  res.json(orders)
}

const requestedOrders = (req, res) => {
  let orders = Orders.getMyOrders()

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

    Orders.create(data)
    console.log('new order', data)

    res.status(201).json(data)
  } catch (err) {
    res.status(400).json({ error: 'cant create ' + err })
  }
}

const deleteOrder = (req, res) => {
  try {
    findOrder(app)(req, res, (order) => {
      Orders.remove(order.id)
      res.status(200).end()
    })
  } catch (err) {
    res.status(400).json({ error: 'cant delete ' + err })
  }
}

const deleteAllOrders = (req, res) => {
  try {
    Orders.getMyOrders().map( order => {
      Orders.remove(order.id)

    })

    res.status(200).end()
  } catch (err) {
    res.status(400).json({ error: 'cant delete ' + err })
  }
}

const requestOrder = (req, res) => {
  findOrder(app)(req, res, (order) => {
    order.sendRequest( accepted => {
      order.isAccepted = accepted
      console.log('accepted', accepted)
      if (!accepted) return
      console.log('peer accepted order', orderView(order))
    })

    order.isAccepted = false
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
      return res.status(404).json({ error: 'no peer' })

    order.acceptRequest(peer)

    console.log('peer', peer)
    console.log('accepting order', orderView(order))

    // const swap = new Swap(order.id)
    // console.log('swap', swap)
    //
    // _swap = swap

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
