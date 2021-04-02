const { Router } = require('express')
const passport = require('../../middlewares/passport')

module.exports = Router()
  .get('/login', passport.authenticate('oidc'))
  .get(
    '/login/callback',
    passport.authenticate('oidc', {
      successRedirect: '/app', // TODO:
      failureRedirect: '/app/login'
    })
  )
  .get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(err => {
      if (err) req.log.error('Failed to destroy the session during logout', err)
      req.user = null
      res.sendStatus(204)
    })
  })
