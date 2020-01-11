const { Router } = require('express')
const Link = require('../../models/link')

module.exports = Router()
  .post('/', async (req, res) => {
    // first check to see if there's already an existing link
    const link =
      (await Link.query()
        .authorize(req.user)
        .findByURL(req.body.originalURL)) ||
      (await req.user
        .$relatedQuery('links')
        .authorize(req.user)
        .insertAndFetch(req.body))

    res.status(201).send(link)
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
