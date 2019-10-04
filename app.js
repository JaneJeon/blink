require('./config')
require('express-async-errors')

const express = require('express')
const app = express()
const passport = require('./lib/passport')
const log = require('./lib/logger')

module.exports = app
  .use(require('./middlewares/access-logger'))
  .use(require('express-request-id')())
  .use(require('./middlewares/express-logger'))
  .use(require('helmet')())
  .use(express.static('public', { index: false }))
  .use(require('./middlewares/session'))
  .use(express.json())
  .use(passport.initialize())
  .use(passport.session())
  .use(require('./routes'))
  .use((req, res) => res.sendStatus(404))
  .use(require('./middlewares/error-handler'))

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(process.env.PORT, function(err) {
    if (err) {
      log.error(err)
      process.exit(1)
    } else log.info(`Server listening on port ${this.address().port}`)
  })

  const mongoose = require('./lib/mongoose')
  process.on('SIGINT', async () => {
    server.close()
    await mongoose.connection.close()
  })
}
