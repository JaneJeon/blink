const express = require('express')
const ensureLogin = require('../../middlewares/ensure-login')
const Link = require('../../models/link')

module.exports = express
  .Router()
  .get('/', ensureLogin, (req, res) => {
    // TODO: some sort of dashboard?
  })
  .get('/links', ensureLogin, async (req, res) => {
    res.send(
      await Link.paginate(
        { creator: req.user.id },
        { sort: '-createdAt', page: req.query.page, limit: 25 }
      )
    )
  })
  .post('/links', ensureLogin, async (req, res) => {
    const link = await Link.create(
      Object.assign(req.body, { creator: req.user.id })
    )
    res.send(link, 201)
  })
