const {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError
} = require('objection')
const { UnauthorizedError } = require('express-jwt')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    req.log.error({ req, err, res }, 'an error occurred after request was sent')
    return
  }

  if (!err.statusCode) {
    if (err instanceof UnauthorizedError) err.statusCode = 401
    else if (err instanceof ValidationError) err.statusCode = 400
    else if (err instanceof NotFoundError) err.statusCode = 404
    else if (err instanceof UniqueViolationError) err.statusCode = 409
    else if (err instanceof DBError) {
      err.statusCode = (() => {
        switch (err.name) {
          case 'NotNullViolationError':
          case 'CheckViolationError':
          case 'DataError':
          case 'ConstraintViolationError':
          case 'ForeignKeyViolationError':
            return 400
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
}
