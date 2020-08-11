// istanbul ignore file
const { Model, AjvValidator, ValidationError } = require('objection')
const tableName = require('objection-table-name')()
const authorize = require('objection-authorize')(require('../policies'), 'casl')
const getPath = require('lodash/get')
const schema = require('../config/schema.json')

Model.knex(require('knex')(require('../knexfile')))

class BaseModel extends authorize(tableName(Model)) {
  static get modelPaths() {
    return [__dirname]
  }

  static get useLimitInFirst() {
    return true
  }

  static get defaultEagerAlgorithm() {
    return Model.JoinEagerAlgorithm
  }

  static get channel() {
    return `lynx:${this.name}`
  }

  static get jsonSchema() {
    return schema[this.name]
  }

  static createValidator() {
    return new AjvValidator({
      // eslint-disable-next-line no-unused-vars
      onCreateAjv: ajv => {}, // need an empty function
      options: {
        // mutating inputs
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true
      }
    })
  }

  // prevent writes to readOnly fields
  static enforceReadOnly(inputItems) {
    inputItems.forEach(inputItem => {
      Object.keys(inputItem).forEach(field => {
        const path = `properties.${field}.readOnly`
        const readOnly = getPath(this.jsonSchema, path)

        if (readOnly)
          throw new ValidationError({ message: 'Cannot edit readOnly field' })
      })
    })
  }

  static async beforeInsert(args) {
    await super.beforeInsert(args)

    this.enforceReadOnly(args.inputItems)
  }

  static async beforeUpdate(args) {
    await super.beforeUpdate(args)

    this.enforceReadOnly(args.inputItems)
  }

  static get QueryBuilder() {
    return class extends super.QueryBuilder {
      insertAndFetch(body) {
        const q = this.insert(body).returning('*')
        return Array.isArray(body) ? q : q.first()
      }

      patchAndFetchById(id, body) {
        return this.findById(id)
          .throwIfNotFound()
          .patch(body)
          .returning('*')
          .first()
      }

      patchAndFetch(body) {
        return this.patch(body).returning('*')
      }

      paginate(query = {}) {
        // defaults
        let page = 0
        let pageSize = 25 // this covers cases where you need to fetch by id up to 25 items
        let column = 'id'
        let direction = 'ASC'
        let filter = {}

        // parse query parameters and do type checks
        try {
          if (query.range) {
            const [start, end] = JSON.parse(query.range)
            if (typeof start !== 'number' || typeof end !== 'number')
              throw new Error()

            // I fucking HATE the way react-admin does pagination,
            // but I just want to get this over with: https://git.io/Jvmnp
            pageSize = end - start + 1
            page = start / pageSize
          }

          if (query.sort) {
            ;[column, direction] = JSON.parse(query.sort)
            if (typeof column !== 'string' || typeof direction !== 'string')
              throw new Error()
          }

          if (query.filter) {
            filter = JSON.parse(query.filter)
            if (typeof filter !== 'object') throw new Error()
          }
        } catch (err) {
          throw new ValidationError({ message: 'Invalid query!' })
        }

        let q = this.page(page, pageSize).orderBy(column, direction)

        for (const [key, value] of Object.entries(filter))
          q = Array.isArray(value) ? q.whereIn(key, value) : q.where(key, value)

        return q
      }
    }
  }
}

module.exports = BaseModel
