// istanbul ignore file
require('./config')
require('express-async-errors')

const express = require('express')
const logger = require('./lib/logger')
const passport = require('./middlewares/passport')
const jwtAuth = require('./middlewares/jwt-auth')

module.exports = express()
  .set('trust proxy', true)
  .use(require('./middlewares/security'))
  .use(express.json())
  .use((req, res, next) => {
    req.id = req.header('X-Request-Id')
    req.log = logger.child({ req })
    next()
  })
  .use(require('express-query-boolean')())
  .use(require('./middlewares/session'))
  .use(passport.initialize(), passport.session())
  .use(jwtAuth.useJwtAuth, jwtAuth.normalizeJwtUser)
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))
