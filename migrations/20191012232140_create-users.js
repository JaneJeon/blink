const tableName = 'users'

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table.increments()
    table.text('role').notNullable()

    table.text('github_id').unique()
    table.text('gitlab_id').unique()
    table.jsonb('profile')

    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable(tableName)
