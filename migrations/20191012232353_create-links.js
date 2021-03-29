exports.up = knex =>
  knex.schema.createTable('links', table => {
    table.increments()
    table.text('hash').unique()
    table.text('original_url').notNullable().unique()
    table.text('creator_id').notNullable().index()

    table.jsonb('meta')

    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTable('links')
