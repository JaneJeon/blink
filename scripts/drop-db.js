#!/usr/bin/env node
const knexCleaner = require('knex-cleaner')
const knex = require('../lib/knex')
const log = require('../lib/logger')

knexCleaner
  .clean(knex, {
    mode: 'truncate',
    restartIdentity: 'true'
  })
  .then(() => {
    log.info('Cleaned the database!')
    process.exit(0)
  })
  .catch(err => {
    log.error(err, 'Failed to clean the database!')
    process.exit(1)
  })
