const { Router } = require('express')
const User = require('../../models/user')

module.exports = Router()
  .get('/', async (req, res) => {
    const { total, results } = await User.query()
      .authorize(req.user)
      .paginate(req.query)

    res.header('Content-Range', `/${total}`)
    res.send(results)
  })
  .get('/:id', async (req, res) => {
    const user = await User.query()
      .authorize(req.user)
      .findById(req.params.id)
      .throwIfNotFound()

    res.send(user)
  })
  .get('/:id/links', async (req, res) => {
    const user = User.fromJson(req.params, { skipValidation: true })
    // TODO: access control on the links
    const links = await user.$relatedQuery('links').paginate(req.query.after)

    res.send(links)
  })
  .patch('/:id', async (req, res) => {
    const user = await User.transaction(async trx => {
      // load the full user context since admins' ability to edit a user's role
      // is affected by his/her role (but otherwise the user.id suffices)
      const user = await User.query(trx)
        .findById(req.params.id)
        .throwIfNotFound()
      return user.$query(trx).authorize(req.user).patchAndFetch(req.body)
    })

    res.send(user)
  })
