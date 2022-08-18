const Router = require('express')
const {
  change,
  get,
  create,
  remove,
} = require('../controllers/pizzaController')
const router = new Router()

router.get('/', get)
router.post('/', create)
router.put('/', change)
router.delete('/', remove)

module.exports = router