const morgan = require('morgan')
const log = require('../lib/logger')

const format = process.env.NODE_ENV === 'development' ? 'dev' : 'tiny'

module.exports = morgan(format, {
  stream: { write: msg => log.debug(msg.trimRight()) }
})
