// istanbul ignore file
require('./config')
require('express-async-errors')

if (process.env.NODE_ENV !== 'production') {
  // cleaner stacks for debugging
  require('trace')
  require('clarify')
}

const express = require('express')
const { auth: oidc } = require('express-openid-connect')
const session = require('cookie-session')
const ms = require('ms')
const get = require('lodash/get')
const { ValidationError, NotFoundError, DBError } = require('objection')
const logger = require('./lib/logger')

module.exports = express()
  .use((req, res, next) => {
    req.log = logger.child({ req })
    next()
  })
  .use(require('helmet')())
  .use(
    session({
      name: 'session',
      secret: process.env.SESSION_SECRET,
      sameSite: 'lax',
      maxAge: ms(process.env.SESSION_DURATION)
    })
  )
  .use(express.json())
  .use(
    oidc({
      enableTelemetry: false,
      attemptSilentLogin: false,
      authRequired: false
    })
  )
  .use((req, res, next) => {
    req.log.info(req.oidc.user)
    if (req.oidc.user)
      req.user = {
        id: req.oidc.user.sub,
        name: get(req.oidc.user, process.env.USER_NAME_FIELD),
        role: get(req.oidc.user, process.env.USER_ROLE)
      }
    next()
  })
  .use(require('express-query-boolean')())
  .use(require('./routes'))
  .use((req, res) => res.sendStatus(404))
  // eslint-disable-next-line no-unused-vars
  .use((err, req, res, next) => {
    if (res.headersSent) {
      req.log.error(
        { req, err, res },
        'an error occurred after request was sent'
      )
      return
    }

    if (!err.statusCode) {
      if (err instanceof ValidationError) err.statusCode = 400
      else if (err instanceof NotFoundError) err.statusCode = 404
      else if (err instanceof DBError) {
        err.statusCode = (() => {
          switch (err.name) {
            case 'NotNullViolationError':
            case 'CheckViolationError':
            case 'DataError':
            case 'ConstraintViolationError':
              return 400
            case 'UniqueViolationError':
            case 'ForeignKeyViolationError':
              return 409
            default:
              return 500
          }
        })()
      } else err.statusCode = 500
    }

    // We *really* don't need to log 401 errors with much detail since there 401s can only come
    // from the ensure-login middleware so any error stack is pretty much useless.
    if (err.statusCode === 401) {
      req.log.warn(err.message)
      return res.sendStatus(err.statusCode)
    }

    req.log[err.statusCode < 500 ? 'warn' : 'error'](err)

    res.status(err.statusCode).send({
      message: err.message,
      name: err.name
    })
  })
