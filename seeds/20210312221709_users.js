const { generate } = require('json-schema-faker')
const User = require('../models/user')

exports.seed = async knex => {
  const users = []
  const ids = {} // prevent duplicates
  const schema = JSON.parse(JSON.stringify(User.jsonSchema))

  // require every field (most importantly the username)
  schema.required = Object.keys(schema.properties)

  // sanity check on the string fields
  schema.properties.id.maxLength = 10
  schema.properties.name.maxLength = 20

  for (let i = 0; i < 30; i++) {
    // generate the raw JSON data for the user in a loop to avoid PK clash
    let obj

    do {
      obj = generate(schema)
    } while (ids[obj.id])

    ids[obj.id] = true
    users.push(obj)
  }

  await knex(User.tableName).insert(users)
}
