require('../config')

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const omit = require('lodash/omit')

let model = process.argv[2]
if (!model || model.includes('.test')) process.exit()
model = path.basename(model).split('.')[0]

const schema = require('../config/schema.json') || {}
const modelSchema = omit(require(`../models/${model}`).jsonSchema(), [
  'properties.createdAt',
  'properties.updatedAt',
  'properties.__v'
])
schema[model] = modelSchema

fs.writeFileSync('config/schema.json', JSON.stringify(schema))
execSync('git add config/schema.json')
