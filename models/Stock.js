const { Schema, model } = require('mongoose')

const Stock = new Schema({
  text: { type: String, required: true },
  image: { type: Buffer, required: true },
})

module.exports = model('Stock', Stock)
