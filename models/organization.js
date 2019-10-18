const BaseModel = require('./base')

class Organization extends BaseModel {
  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'user',
        join: {
          from: 'organizations.id',
          through: {
            from: 'users-organizations.organization_id',
            to: 'users-organizations.user_id'
          },
          to: 'users.id'
        }
      }
    }
  }
}

module.exports = Organization
