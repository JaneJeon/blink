require('./config')
require('express-async-errors')

const express = require('express')
const app = express()
const passport = require('./config/passport')

module.exports = app
  .use(require('./middlewares/access-logger'))
  .use(require('express-request-id')())
  .use(require('./middlewares/express-logger'))
  .use(require('helmet')())
  .use(require('./middlewares/session'))
  .use(express.json())
  .use(require('express-query-boolean')())
  .use(passport.initialize())
  .use(passport.session())
  .use(require('./routes'))
  .use((req, res) => res.sendStatus(404))
  .use(require('./middlewares/error-handler'))

/* -------------------- Asynchronous app init -------------------- */
const fs = require('fs')
const log = require('./lib/logger')
const { Model } = require('objection')
const next = require('./lib/next')

module.exports.initialize = async () => {
  // initialize models for use w/ objection-authorize
  const models = await fs.promises.readdir(`${__dirname}/models`)
  const inits = models
    .filter(
      file =>
        file.endsWith('.js') && !file.endsWith('.test.js') && file !== 'base.js'
    )
    .map(model => {
      const modelClass = require(`./models/${model}`)
      if (!(modelClass instanceof Model)) return
      log.info(`Initializing model ${model}`)

      return modelClass.fetchTableMetadata()
    })

  await Promise.all([...inits, next.prepare()])
}
