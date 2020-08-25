const BaseModel = require('./base')
const hashId = require('objection-hashid')
const { hashFn } = require('../schemas/link')

class Link extends hashId(BaseModel) {
  static get relationMappings() {
    return {
      creator: {
        type: BaseModel.BelongsToOneRelation,
        modelClass: 'user',
        join: {
          from: 'links.creatorId',
          to: 'users.id'
        }
      }
    }
  }

  static get _hashIdInstance() {
    return hashFn
  }

  static get QueryBuilder() {
    return class extends super.QueryBuilder {
      findByHashId(customId) {
        const ids = this.modelClass()._hashIdInstance.decode(customId)

        // if the hashId is encoded, search for the id, else search custom Id directly
        return ids.length ? this.findById(ids[0]) : this.findOne({ customId })
      }
    }
  }
}

module.exports = Link
