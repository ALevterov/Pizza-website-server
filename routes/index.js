const Router = require('express')
const authRouter = require('./authRouter')
const pizzaRouter = require('./pizzaRouter')
const dessertRouter = require('./dessertRouter')
const drinkRouter = require('./drinkRouter')
const stockRouter = require('./stockRouter')
const IntroCardRouter = require('./introCardRouter')
const router = new Router()

router.use('/auth', authRouter)
router.use('/pizza', pizzaRouter)
router.use('/desserts', dessertRouter)
router.use('/drinks', drinkRouter)
router.use('/stocks', stockRouter)
router.use('/introCards', IntroCardRouter)

module.exports = router
