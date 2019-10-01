const logger = require('../lib/logger')
const expressLogger = require('express-pino-logger')

module.exports = expressLogger({
  logger,
  autoLogging: false,
  genReqId: () => {}
})
