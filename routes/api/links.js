const { Router } = require('express')
const Link = require('../../models/link')

module.exports = Router()
  // When "creating" a link, the user is trying to shorten a link.
  // Now, we *could* just throw a 409 when there's a duplicate link,
  // but when we say "oh someone else already shortened that link",
  // the user is going to want to see it anyway, so we skip the back-and-forth
  // between the frontend and the backend and handle duplicate cases right from this endpoint.
  .post('/', async (req, res) => {
    // First, we "create" an instance of link from the requested JSON for two reasons:
    // 1. To put req.body through the link input validator (and throw a 400 if invalid).
    // 2. To normalize the URL so we can look up by it later.
    let link = Link.fromJson(req.body)
    let status = 200

    try {
      // Look at policies/user.js for why we can use $relatedQuery() here.
      link = await req.user.$relatedQuery('links').insertAndFetch(link)
      status = 201
    } catch (err) {
      // When there's an unexpected error, throw it again for the global error handler.
      if (err.name !== 'UniqueViolationError') throw err

      // When there's a duplicate, we can now find a link by the normalized form.
      link = await Link.query().findOne({ originalURL: link.originalURL })
    }

    res.status(status).send(link)
  })
  .get('/', async (req, res) => {
    const links = await Link.query()
      .authorize(req.user)
      .paginate(req.query.after)

    res.send(links)
  })
  .get('/:id', async (req, res) => {
    const link = await Link.query()
      .authorize(req.user)
      .findById(req.params.id)

    res.send(link)
  })
  .patch('/:id', async (req, res) => {
    let link = await Link.query().findById(req.params.id)
    link = await link
      .$query()
      .authorize(req.user)
      .patchAndFetch(req.body)

    res.send(link)
  })
  .delete('/:id', async (req, res) => {
    const link = await Link.query().findById(req.params.id)
    await link
      .$query()
      .authorize(req.user)
      .delete()

    res.sendStatus(204)
  })
