require('dotenv-defaults').config()

const app = require('restana')()
const Link = require('../models/link')

app.use(require('helmet')())
app.use(require('cors')({ origin: true }))
app.get('/', (req, res) => res.redirect(process.env.HOMEPAGE))
app.get('/:url', async (req, res) => {
  const link = await Link.findOne(req.params.url)
  res.redirect(link.redirectTo)
})

if (process.env.NODE_ENV !== 'test')
  app
    .start(process.env.PORT)
    .then(server => {
      const address = server.address()
      console.log(`Server listening at ${address.address}:${address.port}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })

process.on('SIGINT', () => {
  app.close().then(() => process.exit())
})

// for jest testing
module.exports = app.getServer()
