// istanbul ignore file
const { Model, AjvValidator } = require('objection')
const tableName = require('objection-table-name')()
const { DbErrors } = require('objection-db-errors')
const authorize = require('objection-authorize')(require('../lib/acl'))
const visibility = require('objection-visibility').default

const schema = require('../config/schema')

Model.knex(require('knex')(require('../knexfile')))

const supportsReturning = ['pg', 'mssql'].includes(process.env.DATABASE_CLIENT)

class BaseModel extends visibility(authorize(DbErrors(tableName(Model)))) {
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
    return 15
  }

  static createValidator() {
    this.jsonSchema = schema[this.name]

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

  static get QueryBuilder() {
    return class extends super.QueryBuilder {
      insertAndFetch(body) {
        return supportsReturning
          ? this.insert(body)
              .returning('*')
              .first()
          : super.insertAndFetch(body)
      }

      patchAndFetchById(id, body) {
        return supportsReturning
          ? this.findById(id)
              .patch(body)
              .returning('*')
              .first()
          : super.patchAndFetchById(id, body)
      }

      findById(id) {
        return super.findById(id).throwIfNotFound()
      }

      findOne(obj) {
        return super.findOne(obj).throwIfNotFound()
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
