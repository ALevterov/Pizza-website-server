const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function generateJWT(email, id, role) {
  return jwt.sign({ id, email, role }, config.get('ACCESS_SECRET_KEY'), {
    expiresIn: '24h',
  })
}
