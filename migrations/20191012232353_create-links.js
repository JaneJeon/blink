const tableName = require('../models/link').tableName

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table.increments()
    table.text('hash').unique()
    table.text('originalURL').notNullable()
    table
      .text('creator_id')
      .references('users.id')
      .notNullable()

    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable(tableName)
