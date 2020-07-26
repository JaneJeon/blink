const { Router } = require('express')
const ensureLogin = require('../../middlewares/ensure-login')

module.exports = Router()
  .use('/links', ensureLogin, require('./links'))
  .use('/users', ensureLogin, require('./users'))
  .use('/user', ensureLogin, require('./user'))
