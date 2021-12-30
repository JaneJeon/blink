// istanbul ignore file
const pino = require('pino')

let transport
if (process.env.NODE_ENV !== 'production') {
  const dayjs = require('dayjs')

  transport = {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:hh:MM:ss TT',
          singleLine: true,
          ignore: 'pid,hostname'
        }
      },
      {
        target: 'pino/file',
        options: {
          destination: `logs/${dayjs().format('YYYY-MM-DDTHH:mm:ss')}.log`
        }
      }
    ]
  }
}

const options = {
  level: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  customLevels: { log: 30 },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  },
  transport
}

const logger = pino(options)

process.on('uncaughtException', err => {
  logger.error(err, 'uncaughtException')
  process.exitCode = 1
})
process.on('unhandledRejection', reason =>
  logger.error(reason, 'unhandledRejection')
)

module.exports = logger
