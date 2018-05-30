const { Router } = require('express')
const router = new Router()
const swapApp = require('../../services/swapApp')

const {
  listOrders,
  filterOrders,
  orderStatus,
  startSwap,
  acceptSwap,
  signSwap,
  submitSwapSecret,
} = require('./controller')

router.get('/', listOrders)
router.get('/search', filterOrders)
router.get('/:id/status', orderStatus)

router.get('/:id/accept', acceptSwap)
router.get('/:id/start', startSwap)
router.get('/:id/sign-swap', signSwap)
router.get('/:id/submit-secret', submitSwapSecret)

module.exports = router
