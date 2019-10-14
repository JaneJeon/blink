const tableName = 'emails'

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table
      .text('address')
      .primary()
      .notNullable()
    table.boolean('verified').notNullable()
    table.boolean('primary').notNullable()
    table.text('visibility').notNullable()

    table
      .integer('user_id')
      .references('users.id')
      .notNullable()
  })

exports.down = knex => knex.schema.dropTable(tableName)
