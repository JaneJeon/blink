const { Router } = require('express')
const Link = require('../models/link')
const schema = require('../config/schema.json')

module.exports = Router()
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get(`/:hash(${schema.Link.properties.hash.pattern})`, async (req, res) => {
    const link = await Link.query()
      .findByHashId(req.params.hash)
      .throwIfNotFound()

    res.redirect(301, link.originalUrl)
  })
