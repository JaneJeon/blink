const log = require('../lib/logger')

let accessLogger
try {
  const morgan = require('morgan')
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny', {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: msg => log.info(msg.trimRight()) }
  })
} catch (err) {
  accessLogger = (req, res, next) => next()
}

module.exports = accessLogger
