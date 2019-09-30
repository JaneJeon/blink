const express = require('express')

module.exports = express
  .Router()
  .get('/', 'TODO: some sort of dashboard?')
  .use(require('./users'))
  .use(require('./links'))
