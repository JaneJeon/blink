// istanbul ignore file
require('./config')
require('express-async-errors')

const express = require('express')
const logger = require('./lib/logger')
const passport = require('./middlewares/passport')
const { scan } = require('@hapi/bourne')

module.exports = express()
  .set('trust proxy', true)
  .use(require('./middlewares/security'))
  .use(
    express.json({
      verify: (req, res, buf, encoding) => {
        scan(req.body)
      }
    })
  )
  .use(require('express-query-boolean')())
  .use(require('./middlewares/session'))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    req.id = req.header('X-Request-Id')
    req.log = logger.child({ req })
    next()
  })
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))
