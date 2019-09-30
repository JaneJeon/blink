const app = require('../lib/express-factory')()
const passport = require('../lib/passport')

module.exports = app
  .use(require('../middlewares/access-logger'))
  .use(require('helmet')())
  .use(require('cors')())
  .use(require('serve-static')('../public', { index: false }))
  .use(require('../middlewares/session'))
  .use(require('body-parser').json())
  .use(passport.initialize())
  .use(passport.session())
  .use(require('./routes'))
  .finalize()
