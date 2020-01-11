const { Router } = require('express')
const passport = require('../../config/passport')
const log = require('../../lib/logger')

module.exports = Router()
  .get('/slack', passport.authenticate('slack'))
  .get(
    '/slack/callback',
    passport.authenticate('slack', {
      failureRedirect: '/app/login',
      successReturnToOrRedirect: '/app'
    })
  )
  .get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(err => {
      if (err) log.error('Failed to destroy the session during logout', err)
      req.user = undefined
      res.redirect('/')
    })
  })
