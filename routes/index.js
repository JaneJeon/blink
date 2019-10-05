const { Router } = require('express')

module.exports = Router()
  .use('/api', require('./api'))
  .use('/auth', require('./auth'))
  .use('/', require('./redirect'))
