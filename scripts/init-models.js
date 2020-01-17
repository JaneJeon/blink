const fs = require('fs')
const path = require('path')
const log = require('../lib/logger')
const { Model } = require('objection')

module.exports = async () => {
  // initialize models for use w/ objection-authorize
  const models = await fs.promises.readdir(`${path.dirname(__dirname)}/models`)
  const inits = models
    .filter(
      file =>
        file.endsWith('.js') && !file.endsWith('.test.js') && file !== 'base.js'
    )
    .map(model => {
      const modelClass = require(`../models/${model}`)
      if (!(modelClass instanceof Model)) return
      log.info(`Initializing model ${model}`)

      return modelClass.fetchTableMetadata()
    })

  return Promise.all(inits)
}
