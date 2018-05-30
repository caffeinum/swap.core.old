const { Router } = require('express')
const router = new Router()

const orders = require('./orders')
const me = require('./me')

router.use('/orders', orders)
router.use('/me', me)

module.exports = router
