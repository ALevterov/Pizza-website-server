const uuid = require('uuid')
const ApiError = require('../error/ApiError')
const Product = require('../models/Product')
const path = require('path')
const removeImage = require('../utils/removeImage')
const saveImage = require('../utils/saveImage')
const parseToJson = require('../utils/parseToJson')

class ProductController {
  async create(req, res, next) {
    try {
      let { ...data } = req.body
      data = parseToJson(data)

      const { image } = req.files
      let fileName = uuid.v4() + '.jpg'

      saveImage(image, fileName)

      const product = await Product.create({
        ...data,
        image: fileName,
      })

      return res.json(product)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }
  async get(req, res, next) {
    try {
      let { page, limit, sortingProps, type } = req.body

      page = +page
      limit = +limit

      let prop, direction

      if (sortingProps) {
        prop = sortingProps.prop
        direction = sortingProps.direction
      }

      if (sortingProps && prop !== 'popular') {
        if (prop === 'alphabet') {
          prop = 'title'
        }

        const product = await Product.find({ type: type }, null, {
          skip: (page - 1) * limit,
          limit: limit,
          sort: { [prop]: direction ? 'asc' : 'desc' },
        })

        return res.json(product)
      }
      const product = await Product.find({ type: type }, null, {
        skip: (page - 1) * limit,
        limit: limit,
      })

      return res.json(product)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async change(req, res, next) {
    try {
      const { id } = req.query
      let { ...data } = req.body

      data = parseToJson(data)

      if (req.files) {
        const { image } = req.files

        // удаление старой картинки
        const product = await Product.findById(id)

        removeImage(product)

        let fileName = uuid.v4() + '.jpg'

        saveImage(image, fileName)

        const updated = await Product.findByIdAndUpdate(id, {
          ...data,
          image: fileName,
        })

        return res.json(updated)
      }

      const updated = await Product.findByIdAndUpdate(id, { ...data })

      return res.json(updated)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.query

      const data = await Product.findByIdAndDelete(id)

      removeImage(data)

      return res.json(data)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new ProductController()
