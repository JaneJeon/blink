const { tableName } = require('../models/user')

exports.seed = async knex => {
  await knex(tableName).del()
}
