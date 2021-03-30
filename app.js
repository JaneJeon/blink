// istanbul ignore file
require('./config')
require('express-async-errors')

const express = require('express')
const logger = require('./lib/logger')
const get = require('lodash/get')

module.exports = express()
  .use((req, res, next) => {
    req.log = logger.child({ req })
    next()
  })
  .use(require('helmet')())
  .use(express.json())
  .use(require('express-query-boolean')())
  .use(require('./middlewares/authenticate').useAuth)
  .use((req, res, next) => {
    req.user = get(req, 'appSession.user')
    next()
  })
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))
