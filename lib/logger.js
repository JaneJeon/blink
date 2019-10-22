// istanbul ignore file
const pino = require('pino')
const pick = require('lodash/pick')

const logger = pino({
  serializers: {
    err: pino.stdSerializers.err,
    req: req => pick(req, ['id', 'method', 'url', 'user'])
  },
  base: null,
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: { translateTime: true },
  timestamp: process.env.NODE_ENV !== 'production'
})

module.exports = logger
