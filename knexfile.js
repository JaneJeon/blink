// istanbul ignore file
require('./config')
require('pg').types.setTypeParser(20, parseInt) // cast SELECT COUNT(*) to integer

const { knexSnakeCaseMappers } = require('objection')
const log = require('./lib/logger')

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  log: {
    warn: msg => log.warn(msg),
    deprecate: msg => log.warn(msg),
    error: msg => log.error(msg),
    debug: msg => log.debug(msg)
  },
  // TODO: do this for ALL knex projects
  asyncStackTraces: true,
  debug: process.env.NODE_ENV === 'production',
  ...knexSnakeCaseMappers()
}
