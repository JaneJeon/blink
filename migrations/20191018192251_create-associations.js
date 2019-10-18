const tableName = 'membership'

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table
      .text('team_id')
      .notNullable()
      .references('teams.id')
    table
      .text('user_id')
      .notNullable()
      .references('users.id')
    table.primary(['team_id', 'user_id'])
  })

exports.down = knex => knex.schema.dropTable(tableName)
