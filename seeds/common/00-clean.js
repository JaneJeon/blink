const Link = require('../../models/link')
const User = require('../../models/user')

exports.seed = async knex => {
  // Deletes ALL existing entries
  await Link.query().delete()
  await User.query().delete()
}
