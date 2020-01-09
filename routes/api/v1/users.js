const { Router } = require('express')
const User = require('../../../models/user')

module.exports = Router()
  .get('/', async (req, res) => {
    const users = await User.query()
      .authorize(req.user)
      .paginate(req.query.after)
      .filterDeleted(req.query.deleted)

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
    // TODO: access control on the links
    const links = await user.$relatedQuery('links').paginate(req.query.after)

    res.send(links)
  })
  .patch('/:id', async (req, res) => {
    // load the full user context since admins' ability to edit a user's role
    // is affected by his/her role (but otherwise the user.id suffices)
    let user = await User.query().findById(req.params.id)
    user = await user
      .$query()
      .authorize(req.user, undefined, { resourceAugments: { admin: 'admin' } })
      .patchAndFetch(req.body)

    res.send(user)
  })
