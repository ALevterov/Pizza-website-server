const Router = require('express')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

const {
  change,
  get,
  create,
  remove,
} = require('../controllers/productController')
const router = new Router()

router.get('/', get)
router.post('/', checkRoleMiddleware('ADMIN'), create)
router.put('/', checkRoleMiddleware('ADMIN'), change)
router.delete('/', checkRoleMiddleware('ADMIN'), remove)

module.exports = router
