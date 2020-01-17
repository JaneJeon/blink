const Link = require('../models/link')

exports.seed = async knex => {
  await Link.query().delete()
}
