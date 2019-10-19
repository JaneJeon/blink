// istanbul ignore file
require('./config')

if (process.env.DATABASE_CLIENT === 'pg')
  require('pg').types.setTypeParser(20, parseInt) // cast SELECT COUNT(*) to integer

const { knexSnakeCaseMappers } = require('objection')
const log = require('./lib/logger')

module.exports = {
  ...knexSnakeCaseMappers(),
  client: process.env.DATABASE_FILE
    ? {
        filename: process.env.DATABASE_FILE
      }
    : process.env.DATABASE_CLIENT,
  connection: process.env.DATABASE_URL,
  log: {
    warn: msg => log.warn(msg),
    deprecate: msg => log.warn(msg),
    error: msg => log.error(msg),
    debug: msg => log.debug(msg)
  }
}
