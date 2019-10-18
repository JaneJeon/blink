const tableName = 'teams'

exports.up = knex =>
  knex.schema.createTable(tableName, table => {
    table.text('id').notNullable()

    table.text('name')
    table.text('avatar')

    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable(tableName)
