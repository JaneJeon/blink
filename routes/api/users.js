const { Router } = require('express')
const User = require('../../models/user')

module.exports = Router()
  .get('/', async (req, res) => {
    const users = await User.query()
      .authorize(req.user)
      .paginate(req.query.after)

    res.send(users)
  })
  .get('/:id', async (req, res) => {
    const user = await User.query()
      .authorize(req.user)
      .findById(req.params.id)

    res.send(user)
  })
  .get('/:id/links', async (req, res) => {
    const user = User.fromJson(req.params, { skipValidation: true })
    const links = await user.$relatedQuery('links').paginate(req.query.after)

    res.send(links)
  })
  .patch('/:id', async (req, res) => {
    let user = await User.query().findById(req.params.id)
    user = await user
      .$query()
      .authorize(req.user)
      .patchAndFetch(req.body)

    res.send(user)
  })
  .delete('/:id', async (req, res) => {
    // TODO:
    const user = await User.query().findById(req.params.id)
    await user
      .$query()
      .authorize(req.user)
      .delete()

    res.sendStatus(204)
  })
