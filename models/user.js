const { Model } = require('objection')
const BaseModel = require('./base')

class User extends BaseModel {
  static get relationMappings() {
    return {
      links: {
        relation: Model.HasManyRelation,
        modelClass: 'link',
        join: {
          from: 'users.id',
          to: 'links.creatorId'
        }
      }
    }
  }
}

module.exports = User
