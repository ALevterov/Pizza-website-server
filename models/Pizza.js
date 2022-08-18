const { Schema, model, ObjectId } = require('mongoose')

const SizeSchema = new Schema(
  {
    weight: { type: String },
    diametr: { type: String },
    price: { type: String },
  },
  { _id: false }
)

const SizesSchema = new Schema(
  {
    small: { type: SizeSchema },
    medium: { type: SizeSchema },
    large: { type: SizeSchema },
  },
  { _id: false }
)
const DoughSchema = new Schema(
  {
    thin: { type: String, default: 'thin' },
    thick: { type: String, default: 'thick' },
  },
  { _id: false }
)
const SelectedSchema = new Schema(
  {
    size: { type: String },
    dough: { type: String },
  },
  { _id: false }
)
const Pizza = new Schema({
  type: { type: String, required: true, default: 'pizza' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  sizes: { type: SizesSchema, required: true },
  image: { type: Buffer, required: true },
  dough: { type: DoughSchema, required: true },
  selected: { type: SelectedSchema, required: true },
  features: { type: [String], default: [] },
})

module.exports = model('Pizza', Pizza)
