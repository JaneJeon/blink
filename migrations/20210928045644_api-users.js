const { tableName } = require('../models/user')

exports.up = async knex => {
  await knex.schema.table(tableName, table => {
    table.string('')
  })
}

exports.down = async knex => {}
