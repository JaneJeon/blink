const omit = require('lodash/omit')
const log = require('../lib/logger')

// https://mongoosejs.com/docs/api/error.html
module.exports = (err, req, res) => {
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
    }

  log[err.status < 500 ? 'warn' : 'error'](err)

  res.send(err.message, err.status, err.errors)
}
