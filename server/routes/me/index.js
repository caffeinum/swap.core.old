const { Router } = require('express')
const router = new Router()

const { status, balance, getMe, getWallet, listMyOrders } = require('./controller')

router.get('/', getMe)
router.get('/status', status)
router.get('/balance', balance)
router.get('/wallet', getWallet)
router.get('/orders', listMyOrders)

module.exports = router
