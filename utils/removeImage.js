const path = require('path')
const fs = require('fs')
module.exports = function removeImage(pizza) {
  const fileName = pizza.image.toString()

  const filePath = path.resolve(__dirname, '..', 'static', fileName)

  fs.unlink(filePath, () => {})
}
