const { Router } = require('express')
const Link = require('../../models/link')

module.exports = Router()
  .get('/', async (req, res) => {
    const links = await Link.paginate(
      { creator: req.user.id },
      { sort: '-updatedAt', page: req.query.page, limit: 25 }
    )
    res.send(links)
  })
  .get('/:linkId', async (req, res) => {
    res.send(await Link.findById(req.params.linkId))
  })
  .post('/', async (req, res) => {
    res.send(await req.user.createLink(req.body), 201)
  })
