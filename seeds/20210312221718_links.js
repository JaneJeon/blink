const { generate, option } = require('json-schema-faker')
const { ValidationError } = require('objection')
const Link = require('../models/link')

const seedDev = async knex => {
  option({ random: require('seedrandom')('Some seed') })

  const links = []
  const schema = JSON.parse(JSON.stringify(Link.jsonSchema)) // deep copy
  const userIds = await knex('users').select('id').pluck('id')

  // make everything mandatory, including the metadata -
  // we're inserting these objects directly to the database without scraping.
  schema.required = Object.keys(schema.properties).filter(
    property => schema.properties[property].readOnly !== true
  )
  schema.required.push('creatorId')
  schema.properties.meta.required = Object.keys(
    schema.properties.meta.properties
  )

  // but we gotta make sure we still have a valid URL for every object
  schema.properties.originalUrl.format = 'uri'

  // and give some extra wiggle room for normalization
  schema.properties.originalUrl.maxLength = 50

  // Set a random user
  schema.properties.creatorId.enum = userIds

  for (let i = 0; i < 30; i++) {
    // generate the raw JSON data for the link
    let link
    while (!link) {
      try {
        const obj = generate(schema)
        delete obj.id // do not set id
        link = Link.fromJson(obj)
      } catch (err) {
        // Sometimes, you can get unlucky and get a random hash that
        // clashes with the hashids namespace, in which case you just retry.
        if (err instanceof ValidationError) link = null
        else throw err
      }
    }

    // randomly delete the hash
    if (Math.random() < 0.5) delete link.hash

    links.push(link.$toDatabaseJson())
  }

  await knex('links').insert(links)
}

const seedTest = async knex => {
  // noop... for now
}

exports.seed = async knex => {
  const seeder = process.env.NODE_ENV === 'test' ? seedTest : seedDev
  await seeder(knex)
}
