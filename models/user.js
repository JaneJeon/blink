const BaseModel = require('./base')
const softDelete = require('objection-soft-delete')()

class User extends softDelete(BaseModel) {
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

  static get hidden() {
    return ['deleted']
  }
}

module.exports = User
