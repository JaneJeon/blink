// istanbul ignore file
require('./config')
require('pg').types.setTypeParser(20, parseInt) // cast SELECT COUNT(*) to integer

const log = require('./lib/logger')
const { knexSnakeCaseMappers } = require('objection')

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    // no host or pw, cuz why tf would you use dbs in containers for prod?!?
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER
  },
  seeds: {
    directory: `./seeds/${process.env.NODE_ENV}`
  },
  log: {
    warn: msg => log.warn(msg),
    error: msg => log.error(msg),
    deprecate: msg => log.warn(msg),
    debug: msg => log.debug(msg)
  },
  asyncStackTraces: process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
  ...knexSnakeCaseMappers()
}
