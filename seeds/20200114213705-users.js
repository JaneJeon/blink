const User = require('../models/user')

exports.seed = async knex => {
  await knex(User.tableName).del()
  await User.query().insert([
    { id: 'owner', role: 'owner' },
    { id: 'admin', role: 'admin' },
    { id: 'user', role: 'user' }
  ])
}
