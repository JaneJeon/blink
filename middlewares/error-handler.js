const omit = require('lodash/omit')

// https://mongoosejs.com/docs/api/error.html
module.exports = (err, req, res, next) => {
  if (err.status) err.status = Math.min(err.status, 500)
  else
    switch (err.name) {
      case 'CastError':
      case 'StrictModeError':
        err.status = 400
        break
      case 'ValidationError':
        err.status = 400
        for (const prop in err.errors)
          err.errors[prop] = omit(err.errors[prop], [
            'properties',
            'path',
            'value'
          ])
        break
      case 'MongoError':
        err.status = err.code === 11000 ? 409 : 500
        break
      default:
        err.status = 500
    }

  req.log[err.status < 500 ? 'warn' : 'error'](err)
  res.status(err.status).send({ message: err.message, errors: err.errors })
}
