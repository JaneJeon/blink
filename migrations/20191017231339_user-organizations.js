const tableName = 'users-organizations'

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table
      .integer('user_id')
      .references('users.id')
      .notNullable()
    table
      .text('organization_id')
      .references('organizations.id')
      .notNullable()

    table.primary(['user_id', 'organization_id'])
  })

exports.down = knex => knex.schema.dropTable(tableName)
