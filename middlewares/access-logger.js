const morgan = require('morgan')
const log = require('../lib/logger')

module.exports =
  process.env.NODE_ENV === 'production'
    ? (req, res, next) => next()
    : morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny', {
        skip: (req, res) => res.statusCode >= 400,
        stream: { write: msg => log.info(msg.trimRight()) }
      })
