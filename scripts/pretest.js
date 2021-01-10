const npmRun = require('npm-run-all')
const knex = require('../lib/knex')

process.env.NODE_ENV = 'test'

module.exports = async () => {
  await npmRun('build')

  if (!process.env.SKIP_KNEX) {
    await knex.migrate.latest()
    await knex.seed.run()
  }
}
