const { Router } = require('express')
const auth = require('../middlewares/authenticate')

module.exports = Router()
  .use('/api', auth, require('./api'))
  .use('/app', require('./app'))
  .use('/', require('./redirect'))
