const { tableName } = require('../models/link')

exports.seed = async knex => {
  await knex(tableName).del()
}
