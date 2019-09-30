const express = require('express')
const log = require('../../lib/logger')
const passport = require('../../lib/passport')

module.exports = express
  .Router()
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
