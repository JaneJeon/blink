const { Router } = require('express')
const Link = require('../models/link')

module.exports = Router()
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/dashboard', (req, res) => res.redirect(301, '/app'))
  .get('/signup', (req, res) => res.redirect(301, '/app/login'))
  .get('/authorize', (req, res) => res.redirect(301, '/app/login'))
  .get('/logout', (req, res) => res.redirect(301, '/auth/logout'))
  .get('/account', (req, res) => res.redirect(301, '/app/account'))
  .get('/:linkId', async (req, res) => {
    const link = await Link.findById(req.params.linkId)
    res.redirect(301, link.originalURL)
  })
