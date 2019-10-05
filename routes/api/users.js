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
  .get('/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId)
    res.send(user)
  })
  .get('/:userId/links', async (req, res) => {
    // TODO:
    res.send(await req.requestedUser.populate('links').paginate())
  })
