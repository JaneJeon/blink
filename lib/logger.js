const winston = require('winston')

const customFormat = winston.format.printf(info => {
  let { level, message, timestamp, id, stack, ...rest } = info

  // when an error object is passed directly, just print the stack!
  message = stack || message

  // passed from winston.format.timestamp()
  timestamp = timestamp ? `[${timestamp}] ` : ''

  // tracing
  id = id ? ` request_id=${id}` : ''

  // just stringify all other properties
  rest = JSON.stringify(rest, null, 2).replace(/\n/g, '\n  ')
  rest = rest === '{}' ? '' : `\n  ${rest}`

  return `${timestamp}${level.toUpperCase()} ${message}${id}${rest}`
})

let format
switch (process.env.NODE_ENV) {
  case 'development':
    format = winston.format.combine(winston.format.colorize(), customFormat)
    break
  case 'test':
    format = winston.format.combine(winston.format.timestamp(), customFormat)
    break
  default:
    format = customFormat
}

let level = process.env.LOG_LEVEL
if (process.env.NODE_ENV === 'development') level = level || 'verbose'
else if (process.env.NODE_ENV === 'test') level = level || 'warn'
else level = level || 'info'

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
