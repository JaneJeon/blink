require('dotenv-defaults').config()
require('express-async-errors')

const passport = require('./lib/passport')
const express = require('express')
const app = express()

app
  .set('views', 'views')
  .set('view engine', 'hbs')
  .use(require('helmet')())
  .use(require('cors')({ origin: true }))
  .use(express.json())
  .use(require('./middlewares/session'))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.static('public', { index: false }))
  .use(require('./routes'))
  .use(require('./middlewares/error-handler'))

if (process.env.NODE_ENV !== 'test')
  app.listen(process.env.PORT, function(err) {
    if (err) {
      console.error('Could not start server:', err)
      process.exit(1)
    } else console.log(`Server listening at ${this.address()}`)
  })

module.exports = app
