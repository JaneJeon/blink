// istanbul ignore file
const pino = require('pino')
const pick = require('lodash/pick')

let output
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs')

  const streams = [
    {
      stream: fs.createWriteStream(
        `logs/${new Date().toLocaleDateString().replace(/\//g, '-')}.log`,
        { flags: 'a' }
      )
    },
    { stream: process.stdout }
  ]
  output = pino.multistream(streams)
}

let transport
if (process.env.NODE_ENV !== 'production') {
  transport = {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:h:MM:ss TT',
      suppressFlushSyncWarning: true,
      colorize: ['true', '1'].includes(process.env.LOG_COLOURIZE) // fuck ur American spelling
    }
  }
}

const logger = pino(
  {
    serializers: {
      err: pino.stdSerializers.err,
      req: req =>
        pick(req, [
          'id',
          'method',
          'url',
          'user.id',
          'user.role',
          'user.deactivated',
          'query',
          'body'
        ])
    },
    base: null,
    level: (process.env.LOG_LEVEL || 'info').toLowerCase(),
    transport
  },
  output
)

module.exports = logger
