const { validationResult } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Incorrect request', errors })
      }

      const { email, password } = req.body

      const candidate = await User.findOne({ email })

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` })
      }

      const hashPassword = await bcrypt.hash(password, 8)
      const user = new User({ email, password: hashPassword })
      await user.save()
      return res.json({ message: 'User was created' })
    } catch (e) {
      console.log(e)
      res.send({ message: 'Server error' })
    }
  }

  async login(req, res) {}

  async checkUser(req, res, next) {
    const { id } = req.query
    if (!id) {
      return next(ApiError.badRequest('Не задан ID'))
    }
    res.json(id)
  }
}

module.exports = new AuthController()
