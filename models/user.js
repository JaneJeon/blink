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
      organizations: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'organization',
        join: {
          from: 'users.id',
          through: {
            from: 'affiliations.user_id',
            to: 'affiliations.organization_id'
          },
          to: 'organizations.id'
        }
      }
    }
  }

  static get hidden() {
    return ['githubId', 'slackId']
  }
}

module.exports = User
