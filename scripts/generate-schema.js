require('dotenv-defaults').config()

const fs = require('fs')
const omit = require('lodash/omit')

const schema = {}
fs.readdirSync('models')
  .filter(
    f =>
      f.endsWith('.js') && !f.endsWith('.test.js') && !f.startsWith('sequence')
  )
  .map(f => f.slice(0, -3))
  .forEach(model => {
    schema[model] = omit(require(`../models/${model}`).jsonSchema(), [
      'properties.createdAt',
      'properties.updatedAt',
      'properties.__v'
    ])
  })

fs.writeFileSync('config/schema.json', JSON.stringify(schema, null, 2) + '\n')
process.exit(0) // needed since mongoose won't shut down on its own
