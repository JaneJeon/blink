const express = require('express')

module.exports = express
  .Router()
  .use(require('./redirect'))
  .use('/api', require('./api'))
  .use('/app', require('./app'))
  .use('/auth', require('./auth'))
