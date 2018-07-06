const { Router } = require('express')
const router = new Router()

const {
  listOrders,
  filterOrders,
  requestedOrders,

  // orderStatus,
  getOrder,
  createOrder,
  deleteOrder,
  deleteAllOrders,

  requestOrder,
  acceptRequest,
} = require('./controller')

// order list
router.get('/', listOrders)
router.get('/search', filterOrders)
router.get('/requests', requestedOrders)

// create new order
router.post('/', createOrder)

// delete order(s)
router.delete('/all', deleteAllOrders)
router.get('/all/delete', deleteAllOrders)
router.delete('/:id', deleteOrder)
router.get('/:id/delete', deleteOrder)

// actions with order
router.get('/:id', getOrder)

// request swap
router.put('/:id', requestOrder)
router.get('/:id/request', requestOrder)

// incoming request to swap
router.get('/:id/accept', acceptRequest)
router.get('/:id/accept/:peer', acceptRequest)
router.get('/:id/decline/:peer', acceptRequest)

module.exports = router
