exports.up = async knex => {
  await knex.schema.createTable('users', table => {
    table.text('id').primary()
    table.text('role').notNullable()
    table.text('name').notNullable()
    table.boolean('deactivated').notNullable()
  })
  await knex.schema.alterTable('links', table => {
    table.foreign('creator_id').references('users.id')
  })
}

exports.down = async knex => {
  await knex.schema.dropTable('users')
}
