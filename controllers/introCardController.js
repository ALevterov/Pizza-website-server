const uuid = require('uuid')
const ApiError = require('../error/ApiError')
const IntroCard = require('../models/IntroCard')
const removeImage = require('../utils/removeImage')
const saveImage = require('../utils/saveImage')

class IntroCardController {
  async create(req, res, next) {
    try {
      let { ...data } = req.body

      const { image } = req.files
      let fileName = uuid.v4() + '.jpg'

      saveImage(image, fileName)

      const card = await IntroCard.create({
        ...data,
        image: fileName,
      })

      return res.json(card)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async get(req, res, next) {
    try {
      const cards = await IntroCard.find({})
      res.json(cards)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async change(req, res, next) {
    try {
      const { id } = req.query
      let { ...data } = req.body

      if (req.files) {
        const { image } = req.files

        // удаление старой картинки
        const card = await IntroCard.findById(id)

        removeImage(card)

        let fileName = uuid.v4() + '.jpg'

        saveImage(image, fileName)

        const updated = await IntroCard.findByIdAndUpdate(id, {
          ...data,
          image: fileName,
        })

        return res.json(updated)
      }

      const updated = await IntroCard.findByIdAndUpdate(id, { ...data })

      return res.json(updated)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query

      const data = await IntroCard.findByIdAndDelete(id)

      removeImage(data)

      return res.json(data)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new IntroCardController()
