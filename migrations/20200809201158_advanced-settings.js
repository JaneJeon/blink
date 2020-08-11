const { tableName } = require('../models/setting')

exports.up = async knex => {
  await knex.schema.createTable(tableName, table => {
    table.text('id').notNullable().primary()
    table.text('category').notNullable().index()
    table.text('value_data').notNullable()
    table.text('value_type').notNullable()

    table.timestamps(true, true)
  })

  await knex(tableName).insert([
    // user permissions
    {
      id: 'canAdminsDeleteAnyUser',
      category: 'user',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'canAdminsDeleteAnyAdmin',
      category: 'user',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'canUsersPromoteGuestToUser',
      category: 'user',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'canAdminsPromoteAnyoneToAdmin',
      category: 'user',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'canAdminsDemoteAnyAdmin',
      category: 'user',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'defaultRole',
      category: 'user',
      value_data: 'user', // [guest, user, admin]
      value_type: 'string'
    },
    // link permissions
    {
      id: 'whoCanSeeAllLinks',
      category: 'link',
      value_data: 'guest', // [guest, user, admin]
      value_type: 'string'
    },
    {
      id: 'whoCanCreateLink',
      category: 'link',
      value_data: 'user', // [guest, user, admin]
      value_type: 'string'
    },
    {
      id: 'canUsersSetCustomHashForOwnLink',
      category: 'link',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'canAdminsSetCustomHashForAnyLink',
      category: 'link',
      value_data: 'true',
      value_type: 'boolean'
    },
    {
      id: 'canAdminsOverrideCustomHashForAnyLink',
      category: 'link',
      value_data: 'false',
      value_type: 'boolean'
    },
    {
      id: 'whoCanDeleteOwnLink',
      category: 'link',
      value_data: 'admin', // [user, admin, never]
      value_type: 'string'
    },
    {
      id: 'whoCanDeleteAnyLink',
      category: 'link',
      value_data: 'admin', // [user, admin, never]
      value_type: 'string'
    }
  ])
}

exports.down = knex => knex.schema.dropTable(tableName)
