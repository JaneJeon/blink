const knex = require('../lib/knex')

module.exports = async () => {
  await knex.destroy()
}
