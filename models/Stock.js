const { Schema, model } = require('mongoose')

const Stock = new Schema({
  date: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: Buffer, required: true },
})

module.exports = model('Stock', Stock)
