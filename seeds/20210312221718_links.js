const { generate, option } = require('json-schema-faker')
const { ValidationError } = require('objection')
const deepCopy = require('lodash/cloneDeep')
const Link = require('../models/link')
const globalSchema = require('../config/schema/files')

exports.seed = async knex => {
  option({ random: require('seedrandom')('Some seed') })

  const links = []
  const schema = deepCopy(globalSchema.Link)
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
        const obj = generate(schema, [globalSchema.User])
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
