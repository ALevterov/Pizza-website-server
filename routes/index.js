const Router = require('express')
const authRouter = require('./authRouter')
const pizzaRouter = require('./pizzaRouter')
const dessertRouter = require('./dessertRouter')
const drinkRouter = require('./drinkRouter')
const router = new Router()

router.use('/auth', authRouter)
router.use('/pizza', pizzaRouter)
router.use('/desserts', dessertRouter)
router.use('/drinks', drinkRouter)

module.exports = router
