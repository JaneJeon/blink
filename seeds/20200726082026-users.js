const { generate } = require('json-schema-faker')
const User = require('../models/user')

exports.seed = async knex => {
  if (process.env.NODE_ENV === 'test') {
    await User.query().insert([
      { id: 'owner', role: 'owner' },
      { id: 'admin', role: 'admin' },
      { id: 'user', role: 'user' }
    ])
  } else if (process.env.NODE_ENV === 'development') {
    const users = []

    // make everything mandatory
    const schema = JSON.parse(JSON.stringify(User.jsonSchema))
    schema.required = Object.keys(schema.properties)

    // make the id an actual string
    schema.properties.id.pattern = '^\\w+$'

    for (let i = 0; i < 5; i++) {
      const user = Object.assign(generate(schema), {
        // avatar: `https://picsum.photos/200.jpg?random=${i}`,
        deleted: false
      })
      users.push(user)
    }

    await knex(User.tableName).insert(users)
  }
}
