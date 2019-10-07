const { Router } = require('express')
const passport = require('../../config/passport')
const log = require('../../lib/logger')

module.exports = Router()
  .get('/github', passport.authenticate('github'))
  .get(
    '/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/'
    })
  )
  .get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(err => {
      if (err) log.error('Failed to destroy the session during logout', err)
      req.user = null
      res.redirect('/app')
    })
  })
