const { Router } = require('express')
const { requiresAuth } = require('../middlewares/authenticate')

module.exports = Router()
  .use('/api', requiresAuth(), require('./api'))
  .use('/app', require('./app'))
  .use('/', require('./redirect'))
