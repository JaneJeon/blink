const morgan = require('morgan')
const logger = require('../lib/logger')

const format = process.env.NODE_ENV === 'development' ? 'dev' : 'tiny'

module.exports = morgan(format, {
  stream: msg => logger.verbose(msg.trimRight())
})
