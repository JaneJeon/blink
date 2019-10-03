const { Router } = require('express')
const User = require('../../models/user')

module.exports = Router()
  .param('userId', (req, res, next, id) => {
    if (id === req.user.id) req.requestedUser = req.user
    else
      User.findById(id, (err, user) => {
        if (err) next(err)
        req.requestedUser = user
      })
    next()
  })
  .get('/:userId', (req, res) => res.send(req.requestedUser))
  .get('/:userId/links', async (req, res) => {
    res.send(await req.requestedUser.links().paginate())
  })
