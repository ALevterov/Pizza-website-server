const uuid = require('uuid')
const ApiError = require('../error/ApiError')
const Pizza = require('../models/Pizza')
const removeImage = require('../utils/removeImage')
const saveImage = require('../utils/saveImage')
const parseToJson = require('../utils/parseToJson')
class PizzaController {
  async create(req, res, next) {
    try {
      let data = req.body
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
      let { page, limit, pizzaFeature, sortingProps } = req.query

      sortingProps = JSON.parse(sortingProps)
      pizzaFeature = JSON.parse(pizzaFeature)

      page = +page
      limit = +limit

      let prop, direction
      if (sortingProps && sortingProps.length !== 0 && sortingProps.prop) {
        prop = sortingProps.prop
        direction = sortingProps.direction
      } else {
        sortingProps = null
      }

      if (pizzaFeature && pizzaFeature.length !== 0) {
        if (sortingProps && prop !== 'popular') {
          if (prop === 'alphabet') {
            prop = 'title'
          }
          if (prop === 'price') {
            prop = 'sizes.medium.price'
          }
          const count = await Pizza.find({
            features: { $in: pizzaFeature },
          }).count()
          const pizza = await Pizza.find(
            { features: { $in: pizzaFeature } },
            null,
            {
              skip: (page - 1) * limit,
              limit: limit,
              sort: { [prop]: direction ? 'asc' : 'desc' },
            }
          )
          return res.json({ chunk: pizza, count })
        }
        const count = await Pizza.find({
          features: { $in: pizzaFeature },
        }).count()
        const pizza = await Pizza.find(
          { features: { $in: pizzaFeature } },
          null,
          { skip: (page - 1) * limit, limit: limit }
        )
        // pizza = formatImages(pizza)
        return res.json({ chunk: pizza, count })
      }
      if (sortingProps && prop !== 'popular') {
        if (prop === 'alphabet') {
          prop = 'title'
        }
        if (prop === 'price') {
          prop = 'sizes.medium.price'
        }
        const count = await Pizza.find({}).count()

        const pizza = await Pizza.find({}, null, {
          skip: (page - 1) * limit,
          limit: limit,
          sort: { [prop]: direction ? 'asc' : 'desc' },
        })

        return res.json({ chunk: pizza, count })
      }
      const count = await Pizza.find({}).count()
      let pizza = await Pizza.find({}, null, {
        skip: (page - 1) * limit,
        limit: limit,
      })

      return res.json({ chunk: pizza, count })
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }

  async change(req, res, next) {
    try {
      let data = req.body
      let { _id: id } = req.body
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
      if (data.image === 'null') delete data.image

      const updated = await Pizza.findByIdAndUpdate(id, { ...data })

      return res.json(updated)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
  async remove(req, res, next) {
    try {
      const { id } = req.body

      const data = await Pizza.findByIdAndDelete(id)

      removeImage(data)

      return res.json(data)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new PizzaController()
