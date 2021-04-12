// istanbul ignore file
require('./config')

const { parse } = require('pg-connection-string')

const log = require('./lib/logger')
const { knexSnakeCaseMappers } = require('objection')

const env = process.env.NODE_ENV || 'development'

const connection = parse(process.env.DATABASE_URL)
if (env === 'production')
  // heroku requires this
  Object.assign(connection, { ssl: { rejectUnauthorized: false } })

module.exports = {
  client: 'pg',
  connection,
  log: {
    warn: msg => log.warn(msg),
    error: msg => log.error(msg),
    deprecate: msg => log.warn(msg),
    debug: msg => log.debug(msg)
  },
  asyncStackTraces: env !== 'production',
  debug: env !== 'production',
  ...knexSnakeCaseMappers()
}
