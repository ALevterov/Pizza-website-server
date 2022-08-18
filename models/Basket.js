const { Schema, model, ObjectId } = require('mongoose')

const Basket = new Schema({
  user_id: { type: ObjectId, ref: 'User' },
})

module.exports = model('Basket', Basket)
