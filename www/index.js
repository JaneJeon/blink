const app = require('../lib/express-factory')()
const Link = require('../models/link')

module.exports = app
  .use(require('../middlewares/access-logger'))
  .use(require('helmet')())
  .use(require('cors')()) // is this even necessary?
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/:id', async (req, res) => {
    const link = await Link.findById(req.params.id)

    link ? res.redirect(301, link.originalURL) : res.sendStatus(404)
  })
  .finalize()
