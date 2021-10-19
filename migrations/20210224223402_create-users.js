const { tableName } = require('../models/user')
const { tableName: linkTable } = require('../models/link')

exports.up = async knex => {
  await knex.schema.createTable(tableName, table => {
    table.text('id').primary()
    table.text('role').notNullable()
    table.text('name').notNullable()
    table.boolean('deactivated').notNullable()

    table.timestamps(true)
  })
  await knex.schema.alterTable(linkTable, table => {
    table
      .foreign('creator_id')
      .references(`${tableName}.id`)
      .onDelete('CASCADE')
    // we never "delete" users, only deactivate them. The only them we truly remove the user rows is during tests
  })
}

exports.down = async knex => {
  await knex.schema.alterTable(linkTable, table => {
    table.dropColumn('creator_id')
  })
  await knex.schema.dropTable(tableName)
}
