const { Router } = require('express')
const auth = require('../middlewares/require-auth')
const rateLimit = require('../middlewares/rate-limiter')

module.exports = Router()
  .use('/api', auth, rateLimit, require('./api'))
  .use('/app', rateLimit, require('./app'))
  .use('/auth', rateLimit, require('./auth'))
  .use('/', require('./redirect'))
