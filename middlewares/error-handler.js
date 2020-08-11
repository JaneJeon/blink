// istanbul ignore file
const { ValidationError, NotFoundError, DBError } = require('objection')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    req.log.error({ req, err, res }, 'an error occurred after request was sent')
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

  // We *really* don't need to log 401 errors with much detail since 401s can only come
  // from the ensure-login middleware so any error stack is pretty much useless.
  const severity = err.statusCode < 500 ? 'warn' : 'error'
  const errInfo = err.statusCode === 401 ? err.message : err
  req.log[severity](errInfo)
  res.sendStatus(err.statusCode)
}
