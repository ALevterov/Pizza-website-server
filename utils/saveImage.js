const path = require('path')
module.exports = function saveImage(image, fileName) {
  image.mv(path.resolve(__dirname, '..', 'static', fileName))
}
