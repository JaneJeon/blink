// istanbul ignore file
require('./config')

const { parse } = require('pg-connection-string')

const log = require('./lib/logger')
const { knexSnakeCaseMappers } = require('objection')

const env = process.env.NODE_ENV || 'development'

module.exports = {
  client: 'pg',
  connection: Object.assign(parse(process.env.DATABASE_URL), {
    ssl: env === 'production'
  }),
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
