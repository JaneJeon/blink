const winston = require('winston')

let level = process.env.LOG_LEVEL
if (process.env.NODE_ENV === 'development') level = level || 'verbose'
else if (process.env.NODE_ENV === 'test') level = level || 'warn'
else level = level || 'info'

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  process.env.NODE_ENV === 'development'
    ? winston.format.prettyPrint({ colorize: true })
    : winston.format.simple()
)

const transports = [
  new winston.transports.Console({ level, handleExceptions: true })
]

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  require('winston-daily-rotate-file')
  transports.push(
    new winston.transports.DailyRotateFile({
      level: 'debug',
      handleExceptions: true,
      dirname: 'logs',
      filename: `${process.env.NODE_ENV}-%DATE%.log`
    })
  )
}

module.exports = winston.createLogger({ transports, format })
