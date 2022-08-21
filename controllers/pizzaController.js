const uuid = require('uuid')
const ApiError = require('../error/ApiError')
const Pizza = require('../models/Pizza')
const path = require('path')
const fs = require('fs')
const removeImage = require('../utils/removeImage')
const saveImage = require('../utils/saveImage')
const parseToJson = require('../utils/parseToJson')

class PizzaController {
  async create(req, res, next) {
    try {
      let { ...data } = req.body
      data = parseToJson(data)

      const { image } = req.files
      let fileName = uuid.v4() + '.jpg'

      saveImage(image, fileName)

      const pizza = await Pizza.create({
        ...data,
        image: fileName,
      })

      return res.json(pizza)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async get(req, res, next) {
    try {
      let { page, limit, pizzaFeature, sortingProps } = req.body

      page = +page
      limit = +limit

      let prop, direction

      if (sortingProps) {
        prop = sortingProps.prop
        direction = sortingProps.direction
      }

      if (pizzaFeature) {
        if (sortingProps && prop !== 'popular') {
          if (prop === 'alphabet') {
            prop = 'title'
          }
          if (prop === 'price') {
            prop = 'sizes.medium.price'
          }
          const pizza = await Pizza.find(
            { features: { $in: pizzaFeature } },
            null,
            {
              skip: (page - 1) * limit,
              limit: limit,
              sort: { [prop]: direction ? 'asc' : 'desc' },
            }
          )
          console.log(pizza)
          return res.json(pizza)
        }
        const pizza = await Pizza.find(
          { features: { $in: pizzaFeature } },
          null,
          { skip: (page - 1) * limit, limit: limit }
        )
        return res.json(pizza)
      }
      if (sortingProps && prop !== 'popular') {
        if (prop === 'alphabet') {
          prop = 'title'
        }
        if (prop === 'price') {
          prop = 'sizes.medium.price'
        }
        const pizza = await Pizza.find({}, null, {
          skip: (page - 1) * limit,
          limit: limit,
          sort: { [prop]: direction ? 'asc' : 'desc' },
        })

        return res.json(pizza)
      }
      const pizza = await Pizza.find({}, null, {
        skip: (page - 1) * limit,
        limit: limit,
      })

      return res.json(pizza)
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
        const pizza = await Pizza.findById(id)

        removeImage(pizza)

        let fileName = uuid.v4() + '.jpg'

        saveImage(image, fileName)

        const updated = await Pizza.findByIdAndUpdate(id, {
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

      const data = await Pizza.findByIdAndDelete(id)

      removeImage(data)

      return res.json(data)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new PizzaController()
