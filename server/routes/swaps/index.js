const { Router } = require('express')
const router = new Router()

const {
  getSwap,
  goSwap,
  resetSwap,
  refund,
} = require('./controller')

router.get('/:id', getSwap)
router.get('/:id/go', goSwap)
router.get('/:id/reset', resetSwap)
router.get('/:id/refund', refund)

module.exports = router
