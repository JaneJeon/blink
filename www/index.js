require('dotenv-defaults').config()

const service = require('../lib/service-factory')()
const Link = require('../models/link')

service
  .useMiddlewares([
    require('helmet')(),
    require('cors')({ origin: true }) // is this even necessary?
  ])
  .get('/', (req, res) => res.redirect(process.env.HOMEPAGE))
  .get('/:hash', async (req, res) => {
    const link = await Link.findOne(req.params)
    res.redirect(link.redirectTo)
  })

module.exports = service.server
