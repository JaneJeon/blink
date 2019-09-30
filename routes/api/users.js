const express = require('express')
const log = require('../../lib/logger')

module.exports = express.Router().get('/logout', (req, res) => {
  req.logout()
  req.session.destroy(err => {
    if (err) log.error('Failed to destroy the session during logout', err)
    req.user = null
    res.redirect('/')
  })
})
