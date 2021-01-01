const knex = require('knex')(require('../knexfile'))

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line no-undef
  afterAll(async () => {
    await knex().destroy()
  })
}

module.exports = knex
