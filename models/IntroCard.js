const { Schema, model } = require('mongoose')

const IntroCard = new Schema({
  text: { type: String, required: true },
  image: { type: Buffer, required: true },
})

module.exports = model('IntroCard', IntroCard)
