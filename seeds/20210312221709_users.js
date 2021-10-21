const { generate, option } = require('json-schema-faker')
const deepCopy = require('lodash/cloneDeep')
const keys = require('lodash/keys')
const User = require('../models/user')

exports.seed = async knex => {
  option({ random: require('seedrandom')('deez nuts lmao') })

  const users = []
  const schema = deepCopy(User.jsonSchema)

  // require every field (most importantly the username)
  schema.required = keys(schema.properties)

  // sanity check on the string fields
  schema.properties.id.minLength = 2
  schema.properties.id.maxLength = 18
  schema.properties.name.maxLength = 20

  for (let i = 0; i < 30; i++) {
    users.push(generate(schema))
  }

  await knex(User.tableName).insert(users)
}
