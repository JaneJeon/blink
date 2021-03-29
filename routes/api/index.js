const { Router } = require('express')

module.exports = Router()
  .use('/links', require('./links'))
  .use('/users', require('./users'))
  .use('/user', require('./user'))
