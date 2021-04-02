// istanbul ignore file
require('./config')
require('express-async-errors')

const express = require('express')
const logger = require('./lib/logger')
const passport = require('./middlewares/passport')

module.exports = express()
  .use((req, res, next) => {
    req.log = logger.child({ req })
    next()
  })
  .use(require('morgan')('dev'))
  .use(require('helmet')())
  .use(express.json())
  .use(require('express-query-boolean')())
  .use(require('./middlewares/session'))
  .use(passport.initialize())
  .use(passport.session())
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))
