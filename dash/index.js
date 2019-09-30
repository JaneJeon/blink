require('dotenv-defaults').config()

const app = require('../lib/express-factory')()
const passport = require('../lib/passport')
const ensureLogin = require('../middlewares/ensure-login')
const Link = require('../models/link')
const log = require('../lib/logger')

app
  .use(require('helmet')())
  .use(require('cors')())
  .use(require('serve-static')('../public', { index: false }))
  .use(require('../middlewares/session'))
  .use(require('body-parser').json())
  .use(passport.initialize())
  .use(passport.session())
  .get('/') // TODO:
  .get(
    '/login',
    (req, res) =>
      req.isAuthenticated() ? res.redirect('/') : res.render('login') // TODO:
  )
  .get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(err => {
      if (err) log.error('Failed to destroy the session during logout', err)
      req.user = null
      res.redirect('/')
    })
  })
  .get('/auth/github', passport.authenticate('github'))
  .get(
    '/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/'
    })
  )
  .get('/links', ensureLogin, async (req, res) => {
    // TODO:
  })
  .post('/links', ensureLogin, async (req, res) => {
    // TODO:
    const link = await Link.create(
      Object.assign({ creator: req.user.id }, req.body)
    )
    res.send(link, 201)
  })
  .finalize()

module.exports = app
