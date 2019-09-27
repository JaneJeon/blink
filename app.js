require('dotenv-defaults').config()

const app = require('restana')({
  errorHandler: require('./middlewares/error-handler')
})
const passport = require('./lib/passport')

app
  .use(require('helmet')())
  .use(require('cors')({ origin: true }))
  .use(require('body-parser').json())
  .use(passport.initialize())
  .use(passport.session())
  .get('/')
  .get('/login')
  .get('/auth/github', passport.authenticate('github'))
  .get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect(req.session.returnTo || '/')
    }
  ) // TODO: subdomain?!?

app
  .start(process.env.PORT)
  .then(server => {
    console.log(`Server listening at ${server.address}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

process.on('SIGINT', () => {
  app.close().then(() => process.exit())
})

module.exports = app
