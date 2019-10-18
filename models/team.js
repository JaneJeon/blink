const BaseModel = require('./base')

class Organization extends BaseModel {
  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'user',
        join: {
          from: 'teams.id',
          through: {
            from: 'membership.teamId',
            to: 'membership.userId'
          },
          to: 'users.id'
        }
      }
    }
  }
}

module.exports = Organization
