const { Router } = require('express')
const Link = require('../models/link')
const routes = require('../config/routes')

const router = Router()
for (const [from, to] of Object.entries(routes.redirect))
  router.get(`/${from}`, (req, res) => res.redirect(301, to))

module.exports = router
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/:linkId', async (req, res) => {
    const link = await Link.findById(req.params.linkId)
    res.redirect(301, link.originalURL)
  })
