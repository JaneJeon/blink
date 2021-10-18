const {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError
} = require('objection')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    req.log.error({ err }, 'An error occurred after request was sent')
    return
  }

  if (!err.statusCode) {
    if (err instanceof ValidationError) err.statusCode = 400
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
    } else if (err.name === 'UnauthorizedError') err.statusCode = 401
    else if (err.name === 'JwksRateLimitError') err.statusCode = 419
    else err.statusCode = 500
  }

  const loglevel =
    err.statusCode === 401 || err.statusCode === 404
      ? 'debug'
      : err.statusCode < 500
      ? 'warn'
      : 'error'
  req.log[loglevel]({ err })

  res.status(err.statusCode).send(err.message)
}
