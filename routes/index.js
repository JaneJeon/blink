const { Router } = require('express')

module.exports = Router()
  .use('/', require('./redirect'))
  .use('/api', require('./api'))
  .use('/app', require('./app'))
  .use('/auth', require('./auth'))
