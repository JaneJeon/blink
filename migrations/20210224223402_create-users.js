const { tableName } = require('../models/user')

exports.up = async knex => {
  await knex.schema.createTable(tableName, table => {
    table.text('id').primary()
    table.text('role').notNullable()
    table.text('name').notNullable()
    table.boolean('deactivated').notNullable()
  })
  await knex.schema.alterTable('links', table => {
    table.foreign('creator_id').references(`${tableName}.id`)
  })
}

exports.down = async knex => {
  await knex.schema.dropTable(tableName)
}
