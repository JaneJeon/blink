const { tableName } = require('../models/user')
const { API_USER_ID } = require('../config/constants')

// To enable API clients to access Blink, we simply create an API user.
// While API clients really don't map neatly to a user (e.g. role vs. scope, ephemeral vs. persistent),
// it's easiest to just create one user to map an API client's actions onto.
// Then, with the audit log feature we can track arbitrary "immutable id & metadata -> action (subject)",
// i.e. track API action by kid/sub of the JWT.
exports.up = async knex => {
  await knex(tableName).insert({
    id: API_USER_ID,
    role: 'superuser',
    name: 'API Client',
    deactivated: false
  })
}

exports.down = async knex => {
  await knex(tableName).where('id', API_USER_ID).delete()
}
