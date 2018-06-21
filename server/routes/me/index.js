const { Router } = require('express')
const router = new Router()

const { balance, getMe, getWallet, withdraw } = require('./controller')
const { listMyOrders } = require('../orders/controller')

router.get('/', getMe)
router.get('/balance', balance)
router.get('/wallet', getWallet)
router.get('/withdraw/:from', withdraw)
router.get('/orders', listMyOrders)

module.exports = router
