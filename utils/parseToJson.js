module.exports = function parseToJson(data) {
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
