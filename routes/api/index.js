const express = require('express')

module.exports = express
  .Router()
  .use(require('../../middlewares/ensure-login'))
  .use(require('./links'))
  .use(require('./users'))
