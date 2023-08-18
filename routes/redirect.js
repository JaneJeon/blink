const { Router } = require('express')
const Link = require('../models/link')
const schema = require('../config/schema/files')
const ms = require('ms')
const cacheAge = ms(process.env.CACHE_MAX_AGE) / 1000 // in seconds

module.exports = Router()
  .get('/', (req, res) => {
    res.set('Cache-Control', `public, max-age=${cacheAge}`)
    res.redirect(301, process.env.HOMEPAGE)
  })
  .get(`/:hash`, async (req, res) => {
    // Just do the validation in the route; ^pattern$ doesn't work well with express routes.
    if (
      req.params.hash.length < schema.Link.properties.hash.minLength ||
      req.params.hash.length > schema.Link.properties.hash.maxLength ||
      !new RegExp(schema.Link.properties.hash.pattern, 'u').test(req.params)
    )
      return res.sendStatus(404)

    const link = await Link.query()
      .findByHashId(req.params.hash)
      .throwIfNotFound()

    res.set('Cache-Control', `public, max-age=${cacheAge}`)
    res.redirect(301, link.originalUrl)
  })
