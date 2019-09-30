const express = require('express')
const ensureLogin = require('../../middlewares/ensure-login')

module.exports = express
  .Router()
  .use(ensureLogin)
  .use(require('./links'))
  .use(require('./users'))
