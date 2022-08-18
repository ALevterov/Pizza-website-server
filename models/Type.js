const { Schema, model } = require('mongoose')

const Type = new Schema({
  name: { type: String, required: true, unique: true },
})

module.exports = model('Type', Type)
