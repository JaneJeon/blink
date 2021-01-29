const knex = require('../lib/knex')

module.exports = () => {
  afterAll(async () => {
    await knex.destroy()
  })
}
