const { Schema, model, ObjectId } = require('mongoose')

const Product = new Schema({
  type: { type: String, required: true, default: 'Product' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: Buffer, required: true },
  features: { type: [String], default: [] },
  price: { type: String, required: true },
})

module.exports = model('Product', Product)
