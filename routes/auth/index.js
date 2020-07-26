const { Router } = require('express')
const passport = require('../../config/passport')

module.exports = Router()
  .get('/slack', passport.authenticate('slack'))
  .get(
    '/slack/callback',
    passport.authenticate('slack', {
      failureRedirect: `${process.env.FRONTEND_URL}/app/login`,
      successRedirect: `${process.env.FRONTEND_URL}/app/login/callback`
    })
  )
  .get('/logout', (req, res) => {
    // req.logout()
    // req.session.destroy(err => {
    //   if (err) log.error('Failed to destroy the session during logout', err)
    //   req.user = undefined
    //   res.redirect('/')
    // })
    req.session = null
    res.end()
  })
