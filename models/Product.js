const { Schema, model, ObjectId } = require('mongoose')

const Product = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: Buffer, required: true },
  price: { type: String, required: true },
})

module.exports = model('Product', Product)
