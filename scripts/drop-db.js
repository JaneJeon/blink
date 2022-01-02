#!/usr/bin/env node
const knex = require('../lib/knex')
const log = require('../lib/logger')

knex
  .raw('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;')
  .then(() => {
    log.info('Cleaned the database!')
    process.exit(0)
  })
  .catch(err => {
    log.error(err, 'Failed to clean the database!')
    process.exit(1)
  })
