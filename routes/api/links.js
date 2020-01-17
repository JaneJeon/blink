const { Router } = require('express')
const { NotFoundError } = require('objection')
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
    // 2. To normalize the URL so we can look up by it.
    let link = Link.fromJson(req.body)

    try {
      // The link doesn't have an id yet, so see if there's a link by the normalized form.
      link = await Link.query().findOne({ originalURL: link.originalURL })

      res.send(link)
    } catch (err) {
      // When there's an unexpected error, throw it again for the global error handler.
      if (!(err instanceof NotFoundError)) throw err

      // The link doesn't exist, so we're free to create it.
      // Look at policies/user.js for why we can use $relatedQuery() here.
      link = await req.user.$relatedQuery('links').insertAndFetch(link)

      res.status(201).send(link)
    }
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
      .findByHashId(req.params.id)

    res.send(link)
  })
  .patch('/:id', async (req, res) => {
    let link = await Link.query().findByHashId(req.params.id)
    link = await link
      .$query()
      .authorize(req.user)
      .patchAndFetch(req.body)

    res.send(link)
  })
  .delete('/:id', async (req, res) => {
    const link = await Link.query().findByHashId(req.params.id)
    await link
      .$query()
      .authorize(req.user)
      .delete()

    res.sendStatus(204)
  })
