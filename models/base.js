// istanbul ignore file
const { Model, AjvValidator } = require('objection')
const tableName = require('objection-table-name')()
const authorize = require('objection-authorize')(require('../policies'), 'casl')
const visibility = require('objection-visibility').default
const schema = require('../config/schema')

Model.knex(require('knex')(require('../knexfile')))

class BaseModel extends visibility(authorize(tableName(Model))) {
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
        useDefaults: true,
        coerceTypes: true
      }
    })
  }

  processInput() {}

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext)
    await this.processInput(queryContext)
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext)
    await this.processInput(opt, queryContext)
  }

  static async findOrCreate(id, body) {
    const instance = await this.query().findById(id, true)
    return instance || this.query().insertAndFetch(body)
  }

  static get QueryBuilder() {
    return class extends super.QueryBuilder {
      insertAndFetch(body) {
        const q = this.insert(body).returning('*')
        return Array.isArray(body) ? q : q.first()
      }

      patchAndFetchById(id, body) {
        return this.findById(id)
          .patch(body)
          .returning('*')
          .first()
      }

      patchAndFetch(body) {
        const q = this.patch(body).returning('*')
        return Array.isArray(body) ? q : q.first()
      }

      findById(id, silence = false) {
        const q = super.findById(id)
        return silence ? q : q.throwIfNotFound()
      }

      findOne(obj, silence = false) {
        const q = super.findOne(obj)
        return silence ? q : q.throwIfNotFound()
      }

      paginate(after, sortField = 'id', direction = 'desc') {
        return this.skipUndefined()
          .where(sortField, '<', after)
          .orderBy(sortField, direction)
          .limit(this.modelClass().pageSize)
      }
    }
  }
}

module.exports = BaseModel
