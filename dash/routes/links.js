const express = require('express')
const ensureLogin = require('../../middlewares/ensure-login')
const Link = require('../../models/link')

module.exports = express
  .Router()
  .get('/links', ensureLogin, async (req, res) => {
    // TODO: paginate
  })
  .post('/links', ensureLogin, async (req, res) => {
    const link = await Link.create(
      Object.assign(req.body, { creator: req.user.id })
    )
    res.send(link, 201)
  })
