const { Router } = require('express')
const ensureLogin = require('../middlewares/ensure-login')

module.exports = Router()
  .use('/api', ensureLogin, require('./api'))
  .use('/app', require('./app'))
  .use('/', require('./redirect'))
