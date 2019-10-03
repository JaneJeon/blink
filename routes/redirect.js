const { Router } = require('express')
const Link = require('../models/link')

module.exports = Router()
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/:linkId', async (req, res) => {
    const link = await Link.findById(req.params.linkId)
    res.redirect(301, link.originalURL)
  })
