// istanbul ignore file
require('./config')
require('express-async-errors')

const express = require('express')
const logger = require('./lib/logger')

module.exports = express()
  .use((req, res, next) => {
    req.log = logger.child({ req })
    next()
  })
  .use(require('helmet')())
  .use(express.json())
  .use(require('express-query-boolean')())
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))
