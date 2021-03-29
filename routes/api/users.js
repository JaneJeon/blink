const { Router } = require('express')
const User = require('../../models/user')

module.exports = Router()
  .get('/', async (req, res) => {
    const { total, results } = await User.query()
      .paginate(req.query)
      .authorize(req.user)

    res.header('Content-Range', `/${total}`)
    res.send(results)
  })
  .get('/:id', async (req, res) => {
    const user = await User.query()
      .findById(req.params.id)
      .throwIfNotFound()
      .authorize(req.user)

    res.send(user)
  })
  .put('/:id', async (req, res) => {
    const user = await User.query()
      .updateAndFetchById(req.params.id, req.body)
      .authorize(req.user)
      .fetchResourceContextFromDB()
      .diffInputFromResource()

    res.send(user)
  })
