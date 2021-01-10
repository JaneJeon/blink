const knex = require('../lib/knex')

afterAll(async () => {
  await knex.destroy()
})
