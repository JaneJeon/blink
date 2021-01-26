const Link = require('../models/link')

exports.seed = async knex => {
  // Deletes ALL existing entries
  await Link.query().delete()
}
