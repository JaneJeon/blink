const pino = require('pino')

const level =
  process.env.LOG_LEVEL || process.env.NODE_ENV === 'development'
    ? 'debug'
    : process.env.NODE_ENV === 'test'
    ? 'error'
    : 'info'

const logger = pino({ level, prettyPrint: { translateTime: true } })

module.exports = logger
