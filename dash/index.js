require('dotenv-defaults').config()

const app = require('restana')({
  errorHandler: require('../middlewares/error-handler')
})
const passport = require('../lib/passport')
const ensureLogin = require('../middlewares/ensure-login')
const Link = require('../models/link')

app.use(require('helmet')())
app.use(require('cors')({ origin: true }))
app.use(require('serve-static')('../public', { index: false }))
app.use(require('../middlewares/session'))
app.use(require('body-parser').json())
app.use(passport.initialize())
app.use(passport.session())
app.get('/') // TODO:
app.get(
  '/login',
  (req, res) =>
    req.isAuthenticated() ? res.redirect('/') : res.render('login') // TODO:
)
app.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy(err => {
    if (err) console.error('Failed to destroy the session during logout', err)
    req.user = null
    res.redirect('/')
  })
})
app.get('/auth/github', passport.authenticate('github'))
app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/'
  })
)
app.get('/links', ensureLogin, async (req, res) => {
  // TODO:
})
app.post('/links', ensureLogin, async (req, res) => {
  // TODO:
  const link = await Link.create(
    Object.assign({ creator: req.user.id }, req.body)
  )
  res.send(link, 201)
})

if (process.env.NODE_ENV !== 'test')
  app
    .start(process.env.PORT)
    .then(server => {
      const address = server.address()
      console.log(`Server listening at ${address.address}:${address.port}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

process.on('SIGINT', () => {
  app.close().then(() => process.exit())
})

// for jest testing
module.exports = app.getServer()
