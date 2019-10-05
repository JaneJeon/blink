const { Router } = require('express')
const Link = require('../../models/link')

module.exports = Router()
  .get('/', async (req, res) => {
    const links = await Link.paginate({}, { page: req.query.page })
    res.send(links)
  })
  .get('/:linkId', async (req, res) => {
    res.send(await Link.findById(req.params.linkId))
  })
  .post('/', async (req, res) => {
    res.status(201).send(await req.user.createLink(req.body))
  })
