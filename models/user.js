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
      },
      teams: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'team',
        join: {
          from: 'users.id',
          through: {
            from: 'membership.userId',
            to: 'membership.teamId'
          },
          to: 'teams.id'
        }
      }
    }
  }
}

module.exports = User
