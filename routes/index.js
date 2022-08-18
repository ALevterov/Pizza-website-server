const Router = require('express')
const authRouter = require('./authRouter')
const pizzaRouter = require('./pizzaRouter')
const router = new Router()

router.use('/auth', authRouter)
router.use('/pizza', pizzaRouter)
// router.use('/desserts')
// router.use('/drinks')

module.exports = router
