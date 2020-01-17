const BaseModel = require('./base')

class User extends BaseModel {
  static get relationMappings() {
    return {
      links: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'link',
        join: {
          from: 'users.id',
          to: 'links.creatorId'
        }
      }
    }
  }

  static get QueryBuilder() {
    return class extends BaseModel.QueryBuilder {
      filterDeleted(deleted = false) {
        return this.where({ deleted })
      }
    }
  }
}

module.exports = User
