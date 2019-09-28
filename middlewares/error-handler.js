const omit = require('lodash/omit')

// https://mongoosejs.com/docs/api/error.html
module.exports = (err, req, res, next) => {
  let { status, message, errors } = err
  if (status) status = Math.min(status, 500)
  else
    switch (err.name) {
      case 'CastError':
      case 'StrictModeError':
        status = 400
        break
      case 'ValidationError':
        status = 400
        for (const prop in errors)
          errors[prop] = omit(errors[prop], ['properties', 'path', 'value'])
    }

  console.error({ status, message: message, errors })

  res.status(status).send(message)
}
