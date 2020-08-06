const { generate } = require('json-schema-faker')
const Link = require('../../models/link')
const User = require('../../models/user')
const { ValidationError } = require('objection')

exports.seed = async knex => {
  const users = await User.query()
  const links = []

  // make everything mandatory, including the metadata -
  // we're inserting these objects directly to the database without scraping.
  const schema = JSON.parse(JSON.stringify(Link.jsonSchema))
  schema.required = Object.keys(schema.properties).filter(
    property => schema.properties[property].readOnly !== true
  )
  schema.properties.meta.required = Object.keys(
    schema.properties.meta.properties
  )

  // but we gotta make sure we still have a valid URL for every object
  schema.properties.originalUrl.format = 'uri'

  // and give some extra wiggle room for normalization
  schema.properties.originalUrl.maxLength = 50

  for (let i = 0; i < 30; i++) {
    // generate the raw JSON data for the link
    let link
    while (!link) {
      try {
        link = Link.fromJson(generate(schema))
      } catch (err) {
        // Sometimes, you can get unlucky and get a random hash that
        // clashes with the hashids namespace, in which case you just retry.
        if (err instanceof ValidationError) link = null
        else throw err
      }
    }

    // randomly delete the hash
    if (Math.random() < 0.65) delete link.hash

    const creatorId = users[Math.floor(Math.random() * users.length)].id
    links.push(Object.assign(link.$toDatabaseJson(), { creatorId }))
  }

  await knex(Link.tableName).insert(links)
}