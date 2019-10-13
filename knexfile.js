// istanbul ignore file
if (process.env.DATABASE_CLIENT === 'pg') {
  const { types } = require('pg')
  const dayjs = require('dayjs')
  types.setTypeParser(20, parseInt) // cast SELECT COUNT(*) to integer
  // to get around jsonschema validation quirks regarding date objects vs. strings
  types.setTypeParser(1082, obj => dayjs(obj).format('YYYY-MM-DD'))
}

const { knexSnakeCaseMappers } = require('objection')
const log = require('./lib/logger')

module.exports = {
  ...knexSnakeCaseMappers(),
  client: process.env.DATABASE_CLIENT,
  connection: process.env.DATABASE_URL,
  log: {
    warn: msg => log.warn(msg),
    deprecate: msg => log.warn(msg),
    error: msg => log.error(msg),
    debug: msg => log.debug(msg)
  }
}
