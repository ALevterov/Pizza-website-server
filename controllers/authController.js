const { validationResult } = require('express-validator')
const User = require('../models/User')
const Basket = require('../models/Basket')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const generateJWT = require('../utils/generateJWT')
const config = require('config')

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(errors))
      }

      const { email, password } = req.body

      const candidate = await User.findOne({ email })

      if (candidate) {
        return next(
          ApiError.badRequest(`User with email ${email} already exist`)
        )
      }
      let role

      if (password === config.get('ADMIN_PASS')) {
        role = 'ADMIN'
      } else {
        role = 'USER'
      }

      const hashPassword = await bcrypt.hash(password, 8)
      const user = new User({ email, password: hashPassword, role })
      await user.save()
      const basket = await Basket.create({
        user_id: user.id,
      })

      const token = generateJWT(email, user.id, role)

      return res.json(token)
    } catch (e) {
      console.log(e)
      next(ApiError.badRequest(e.message))
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(ApiError.badRequest(errors))
      }

      const { email, password } = req.body

      const candidate = await User.findOne({ email })

      if (!candidate) {
        return next(
          ApiError.badRequest(`Пользователь с таким email не существует`)
        )
      }
      let comparePassword = await bcrypt.compare(password, candidate.password)

      if (!comparePassword) {
        return res.json('Неверный пароль')
      }

      const token = generateJWT(candidate.email, candidate.id)
      return res.json(token)
    } catch (e) {
      console.log(e)
      next(ApiError.badRequest(e.message))
    }
  }

  async checkUser(req, res, next) {
    const { email, id } = req.user
    const token = generateJWT(email, id)
    return res.json(token)
  }
}

module.exports = new AuthController()
