const { tableName } = require('../models/link')

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table.increments()
    table.text('hash').unique()
    table.text('original_url').notNullable().unique()
    table.text('creator_id').notNullable().index()

    table.jsonb('meta')

    table.timestamps(true)
  })

exports.down = knex => knex.schema.dropTable(tableName)
