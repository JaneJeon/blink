const knex = require('knex')(require('../knexfile'))

if (process.env.JEST_WORKER_ID) {
  // eslint-disable-next-line no-undef
  afterAll(async () => {
    await knex.destroy()
  })
}

module.exports = knex
