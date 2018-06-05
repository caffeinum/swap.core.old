const { Router } = require('express')
const router = new Router()

const {
  getSwap,
  goSwap,
} = require('./controller')

router.get('/:id', getSwap)
router.get('/:id/go', goSwap)

module.exports = router
