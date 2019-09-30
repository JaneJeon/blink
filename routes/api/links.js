const express = require('express')
const Link = require('../../models/link')

module.exports = express
  .Router()
  .get('/links', async (req, res) => {
    res.send(
      await Link.paginate(
        { creator: req.user.id },
        { sort: '-updatedAt', page: req.query.page, limit: 25 }
      )
    )
  })
  .get('/links/:id', async (req, res) => {
    res.send(await Link.findById(req.params.id))
  })
  .post('/links', async (req, res) => {
    const link = await Link.create(
      Object.assign(req.body, { creator: req.user.id })
    )
    res.send(link, 201)
  })
