// istanbul ignore file
const pino = require('pino')
const pick = require('lodash/pick')

const logger = pino({
  serializers: {
    err: pino.stdSerializers.err,
    req: req => pick(req, ['id', 'method', 'url', 'user', 'query', 'body'])
  },
  base: null,
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint:
    process.env.NODE_ENV === 'production'
      ? false
      : {
          translateTime: 'SYS:h:MM:ss TT'
        }
})

if (process.env.NODE_ENV === 'production')
  process
    .on(
      'uncaughtException',
      pino.final(logger, (err, finalLogger) => {
        finalLogger.error(err, 'uncaughtException')
        process.exit(1)
      })
    )
    .on(
      'unhandledRejection',
      pino.final(logger, (err, finalLogger) => {
        finalLogger.error(err, 'unhandledRejection')
        process.exit(1)
      })
    )

module.exports = logger
