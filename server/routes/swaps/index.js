const { Router } = require('express')
const router = new Router()

const {
  getSwap,
} = require('./controller')

router.get('/:id', getSwap)

module.exports = router
