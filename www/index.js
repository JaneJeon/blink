require('dotenv-defaults').config()

const app = require('../lib/express-factory')()
const Link = require('../models/link')

app
  .use(require('../middlewares/access-logger'))
  .use(require('helmet')())
  .use(require('cors')()) // is this even necessary?
  .get('/', (req, res) => res.redirect(301, process.env.HOMEPAGE))
  .get('/:hash', async (req, res) => {
    const link = await Link.findOne(req.params)
    res.redirect(301, link.redirectTo)
  })
  .finalize()

module.exports = app
