const { Router } = require('express')
const Link = require('../models/link')
const schema = require('../config/schema.json')
const ms = require('ms')
const cacheAge = ms(process.env.CACHE_MAX_AGE) / 1000 // in seconds

module.exports = Router()
  .get('/', (req, res) => {
    res.set('Cache-Control', `public, max-age=${cacheAge}`)
    res.redirect(301, process.env.HOMEPAGE)
  })
  .get(`/:hash(${schema.Link.properties.hash.pattern})`, async (req, res) => {
    const link = await Link.query()
      .findByHashId(req.params.hash)
      .throwIfNotFound()

    res.set('Cache-Control', `public, max-age=${cacheAge}`)
    res.redirect(301, link.originalUrl)
  })
