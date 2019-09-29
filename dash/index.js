require('dotenv-defaults').config()

const service = require('../lib/service-factory')()
const passport = require('../lib/passport')
const ensureLogin = require('../middlewares/ensure-login')
const Link = require('../models/link')
const log = require('../lib/logger')

service
  .useMiddlewares([
    require('helmet')(),
    require('cors')({ origin: true }),
    require('serve-static')('../public', { index: false }),
    require('../middlewares/session'),
    require('body-parser').json(),
    passport.initialize(),
    passport.session()
  ])
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

module.exports = service.server
