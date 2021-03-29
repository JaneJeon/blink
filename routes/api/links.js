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
    // 2. To normalize the URL so we can look up by it.
    const input = Link.fromJson(
      Object.assign(req.body, { creatorId: req.user.id })
    )

    const link = await Link.transaction(async trx => {
      // The link doesn't have an id yet, so see if there's a link by the normalized form.
      const existingLink = await Link.query(trx)
        .findOne({
          originalUrl: input.originalUrl
        })
        .authorize(req.user)
      if (existingLink) return existingLink

      // The link doesn't exist, so we're free to create it.
      return Link.query(trx).insertAndFetch(input).authorize(req.user)
    })

    res.status(201).send(link)
  })
  .get('/', async (req, res) => {
    const { total, results } = await Link.query()
      .paginate(req.query)
      .authorize(req.user)

    res.header('Content-Range', `/${total}`)
    res.send(results)
  })
  .get('/:id', async (req, res) => {
    const link = await Link.query()
      .findByHashId(req.params.id)
      .throwIfNotFound()
      .authorize(req.user)

    res.send(link)
  })
  .put('/:id', async (req, res) => {
    const link = await Link.query()
      .findByHashId(req.params.id)
      .throwIfNotFound()
      .updateAndFetch(Object.assign(req.body, { creatorId: req.user.id }))
      .authorize(req.user)
      .fetchResourceContextFromDB()
      .diffInputFromResource()

    res.send(link)
  })
  .delete('/:id', async (req, res) => {
    await Link.query()
      .findByHashId(req.params.id)
      .throwIfNotFound()
      .delete()
      .authorize(req.user)
      .fetchResourceContextFromDB()

    res.sendStatus(204)
  })
