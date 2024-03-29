const knex = require('./knex')

module.exports = async () => {
  if (process.env.AUTO_MIGRATE === '1') await knex.migrate.latest()
  if (process.env.AUTO_SEED === '1') await knex.seed.run()
}
