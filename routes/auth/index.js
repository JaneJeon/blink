const { Router } = require('express')
const passport = require('../../lib/passport')
const log = require('../../lib/logger')

module.exports = Router()
  .get('/slack', passport.authenticate('slack'))
  .get(
    '/slack/callback',
    passport.authenticate('slack', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/'
    })
  )
  .get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(err => {
      if (err) log.error('Failed to destroy the session during logout', err)
      req.user = null
      res.redirect('/')
    })
  })
