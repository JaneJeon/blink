const { Router } = require('express')
const passport = require('@passport-next/passport')

module.exports = Router()
  .get('/login', passport.authenticate('oidc'))
  .get(
    '/login/callback',
    passport.authenticate('oidc', {
      successRedirect: '/app',
      failureRedirect: '/app/login'
    })
  )
  .get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(err => {
      if (err) req.log.error({ err }, 'Failed to destroy session during logout')
      req.user = null
      res.sendStatus(204)
    })
  })
