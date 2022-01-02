const knex = require('./knex')
const redis = require('./redis')
const log = require('./logger')

module.exports = async () => {
  log.info('Closing DB connections...')
  await knex.destroy()
  log.info('Closing Redis connections...')
  await redis.quit()
  log.info('Closed all connections!')

  // Unfortunately, this is not enough - pino's transports and custom log levels
  // for some reason still use streams and don't tear them down at the end.
}
