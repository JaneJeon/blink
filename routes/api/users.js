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
    const link = await User.query()
      .findById(req.params.id)
      .throwIfNotFound()
      .authorize(req.user)

    res.send(link)
  })
  .put('/:id', async (req, res) => {
    const link = await User.query()
      .updateAndFetchById(req.params.id, req.body)
      .authorize(req.user)
      .fetchResourceContextFromDB()
      .diffInputFromResource()

    res.send(link)
  })
  .post('/:id', async (req, res) => {
    // this isn't the endpoint for "creating" a user through the SSO;
    // rather, this is where admins can reactivate users who were previously banned
    const user = await User.query()
      .insertAndFetch(req.body)
      .authorize(req.user)
      .action('reactivate')
      .fetchResourceContextFromDB()

    res.status(201).send(user)
  })
  .delete('/:id', async (req, res) => {
    // Similarly, you don't "delete" a user - we deactivate them
    await User.query()
      .deleteById(req.params.id)
      .authorize(req.user)
      .action('deactivate')
      .fetchResourceContextFromDB()

    res.sendStatus(204)
  })
