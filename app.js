// istanbul ignore file
require('./config')
require('express-async-errors')

const express = require('express')
const { scan } = require('@hapi/bourne')
const logger = require('./lib/logger')
const passport = require('./middlewares/passport')
const jwtAuth = require('./middlewares/jwt-auth')
const rateLimit = require('./middlewares/rate-limiter')

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
  .use((req, res, next) => {
    req.id = req.header('X-Request-Id')
    req.log = logger.child({ req })
    req.isApi = !!req.header('Authorization')
    next()
  })
  .use(require('express-query-boolean')())
  .use(require('./middlewares/session'))
  .use(passport.init)
  .use(passport.sess)
  .use(jwtAuth.useJwtAuth)
  .use(jwtAuth.normalizeJwtUser)
  .use(rateLimit.short)
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))
