require('dotenv-defaults').config()
require('express-async-errors')

const express = require('express')
const log = require('./logger')

module.exports = () => {
  const app = express()
  let server

  app.finalize = () => {
    app
      .use((req, res) => res.sendStatus(404))
      .use(require('../middlewares/error-handler'))

    if (!server && process.env.NODE_ENV !== 'test') {
      server = app.listen(process.env.PORT, function(err) {
        if (err) {
          log.error(err)
          process.exit(1)
        } else log.info(`Express server listening on port ${this.address().port}`)
      })

      process.on('SIGINT', () => {
        server.close()
      })
    }

    return app
  }

  return app
}
