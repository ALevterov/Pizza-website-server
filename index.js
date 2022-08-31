const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const router = require('./routes/index')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const errorHandler = require('./middleware/errorHandlingMiddleware')
const PORT = process.env.PORT || config.get('serverPort') || 4000
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)
const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'))
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`)
    })
  } catch (error) {}
}

start()
