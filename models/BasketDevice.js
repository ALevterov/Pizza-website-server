const { Schema, model, ObjectId } = require('mongoose')

const BasketDevice = new Schema({
  product_id: { type: ObjectId, ref: 'Product' },
  BasketDevice_id: { type: ObjectId, ref: 'BasketDevice' },
})

module.exports = model('BasketDevice', BasketDevice)
