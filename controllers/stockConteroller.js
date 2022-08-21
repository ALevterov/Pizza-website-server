const uuid = require('uuid')
const ApiError = require('../error/ApiError')
const Stock = require('../models/Stock')
const path = require('path')
const fs = require('fs')
const removeImage = require('../utils/removeImage')
const saveImage = require('../utils/saveImage')
const parseToJson = require('../utils/parseToJson')

class StockController {
  async create(req, res, next) {
    try {
      let { ...data } = req.body

      const { image } = req.files
      let fileName = uuid.v4() + '.jpg'

      saveImage(image, fileName)

      const stock = await Stock.create({
        ...data,
        image: fileName,
      })

      return res.json(stock)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async get(req, res, next) {
    try {
      const stocks = Stock.find({})
      res.json(stocks)
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
        const stock = await Stock.findById(id)

        removeImage(stock)

        let fileName = uuid.v4() + '.jpg'

        saveImage(image, fileName)

        const updated = await Stock.findByIdAndUpdate(id, {
          ...data,
          image: fileName,
        })

        return res.json(updated)
      }

      const updated = await Pizza.findByIdAndUpdate(id, { ...data })

      return res.json(updated)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query

      const data = await Stock.findByIdAndDelete(id)

      removeImage(data)

      return res.json(data)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new StockController()
