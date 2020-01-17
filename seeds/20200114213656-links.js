const Link = require('../models/link')

exports.seed = async knex => {
  await knex(Link.tableName).del()
}
