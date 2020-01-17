const { tableName } = require('../models/user')

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table
      .text('id')
      .notNullable()
      .primary()
    table.text('role').notNullable()

    table.text('name')
    table.text('avatar')

    table.boolean('deleted').notNullable()

    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable(tableName)
