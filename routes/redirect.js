const { Router } = require('express')
const Link = require('../models/link')
const schema = require('../config/schema')
const hashSchema = schema.Link.properties.hash
const possibleHash = `/:hash([a-zA-Z0-9]{${hashSchema.minLength},${hashSchema.maxLength}})`

module.exports = Router()
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get(possibleHash, async (req, res) => {
    const link = await Link.query().findByHashId(req.params.hash)

    res.redirect(301, link.originalURL)
  })
