// istanbul ignore file
const { Model, AjvValidator } = require('objection')
const tableName = require('objection-table-name')()
const authorize = require('objection-authorize')
const policies = require('../policies')
const schema = require('../config/schema/files')
const httpError = require('http-errors')

Model.knex(require('../lib/knex'))

class BaseModel extends authorize(policies, 'casl', {
  casl: { useInputItemAsResourceForRelation: true }
})(tableName(Model)) {
  static get modelPaths() {
    return [__dirname]
  }

  static get useLimitInFirst() {
    return true
  }

  static get defaultEagerAlgorithm() {
    return Model.JoinEagerAlgorithm
  }

  static get pageSize() {
    return 25
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
        useDefaults: true
      }
    })
  }

  static get QueryBuilder() {
    return class extends super.QueryBuilder {
      insertAndFetch(body) {
        const q = this.insert(body).returning('*')
        return Array.isArray(body) ? q : q.first()
      }

      updateAndFetch(body) {
        const q = this.update(body).returning('*')
        return Array.isArray(body) ? q : q.first()
      }

      updateAndFetchById(id, body) {
        return this.findById(id).throwIfNotFound().updateAndFetch(body)
      }

      deleteById(id, body) {
        return this.findById(id).throwIfNotFound().delete(body)
      }

      // Massage .page() in a way that react-admin likes
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
          throw httpError(400, 'Invalid query!')
        }

        // I really don't want to be using offset...
        let q = this.page(page, pageSize).orderBy(column, direction)

        for (const [key, value] of Object.entries(filter))
          q = Array.isArray(value) ? q.whereIn(key, value) : q.where(key, value)

        return q
      }
    }
  }
}

module.exports = BaseModel
