const { Router } = require('express')
const router = new Router()

const orders = require('./orders')
const me = require('./me')
const swaps = require('./swaps')

router.use('/orders', orders)
router.use('/me', me)
router.use('/swaps', swaps)

module.exports = router
