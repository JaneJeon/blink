const { Router } = require('express')
const User = require('../../models/user')
const { requireScope } = require('../../middlewares/jwt-auth')

module.exports = Router()
  .get('/', requireScope('user:read'), async (req, res) => {
    const { total, results } = await User.query()
      .paginate(req.query)
      .authorize(req.user)

    res.header('Content-Range', `/${total}`)
    res.send(results)
  })
  .get('/:id', requireScope('user:read'), async (req, res) => {
    const user = await User.query()
      .findById(req.params.id)
      .throwIfNotFound()
      .authorize(req.user)

    res.send(user)
  })
  .get('/:id/links', requireScope('user:read link:read'), async (req, res) => {
    const { total, results } = await User.relatedQuery('links')
      .for(req.params.id)
      .paginate(req.query)
      .authorize(req.user)

    res.header('Content-Range', `/${total}`)
    res.send(results)
  })
  .put('/:id', requireScope('user:update'), async (req, res) => {
    const user = await User.query()
      .updateAndFetchById(req.params.id, req.body)
      .authorize(req.user)
      .fetchResourceContextFromDB()
      .diffInputFromResource()

    res.send(user)
  })
