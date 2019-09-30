const express = require('express')
const Link = require('../models/link')

module.exports = express
  .Router()
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/:linkId', async (req, res) => {
    const link = await Link.findById(req.params.linkId)
    link ? res.redirect(301, link.originalURL) : res.sendStatus(404)
  })
