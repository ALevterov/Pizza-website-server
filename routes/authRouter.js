const Router = require('express')
const { check } = require('express-validator')
const {
  registration,
  login,
  checkUser,
} = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post(
  '/registration',
  [
    check('email', 'Incorrect email').isEmail(),
    check(
      'password',
      'Password must be longer than 3 and shorter than 12'
    ).isLength({ min: 3, max: 12 }),
  ],
  registration
)
router.post('/login', login)
router.post('/check', authMiddleware, checkUser)
module.exports = router
