const { Router } = require('express')
const Link = require('../models/link')

module.exports = Router()
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/:hash(\\w+)', async (req, res) => {
    const link = await Link.query()
      .findByHashId(req.params.hash)
      .throwIfNotFound()

    res.redirect(301, link.originalUrl)
  })
