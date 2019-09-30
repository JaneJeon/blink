const express = require('express')
const passport = require('../../lib/passport')

module.exports = express
  .Router()
  .get('/github', passport.authenticate('github'))
  .get(
    '/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login',
      successReturnToOrRedirect: '/'
    })
  )
