const uuid = require('uuid')
const ApiError = require('../error/ApiError')
const Pizza = require('../models/Pizza')
const path = require('path')

function parseToJson(data) {
  if (data.selected) {
    data.selected = JSON.parse(data.selected)
  }
  if (data.sizes) {
    data.sizes = JSON.parse(data.sizes)
  }
  if (data.dough) {
    data.dough = JSON.parse(data.dough)
  }
  if (data.features) {
    data.features = JSON.parse(data.features)
  }
  return data
}
class PizzaController {
  async create(req, res, next) {
    try {
      let { ...data } = req.body
      data = parseToJson(data)

      const { image } = req.files
      let fileName = uuid.v4() + '.jpg'
      image.mv(path.resolve(__dirname, '..', 'static', fileName))

      // selected = JSON.parse(selected)
      // sizes = JSON.parse(sizes)
      // dough = JSON.parse(dough)
      // features = JSON.parse(features)

      const pizza = await Pizza.create({
        ...data,
        image: fileName,
      })

      return res.json(pizza)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async get(req, res) {}

  async change(req, res, next) {
    try {
      const { id } = req.query
      let { ...data } = req.body
      console.log(data)
      data = parseToJson(data)

      const { image } = req.files

      if (image) {
        let fileName = uuid.v4() + '.jpg'
        image.mv(path.resolve(__dirname, '..', 'static', fileName))
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
      console.log(id)
      const data = await Pizza.findByIdAndDelete(id)

      return res.json(data)
    } catch (e) {
      return next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new PizzaController()
