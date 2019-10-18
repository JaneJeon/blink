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
            from: 'affiliations.organization_id',
            to: 'affiliations.user_id'
          },
          to: 'users.id'
        }
      }
    }
  }

  static async createSlackOrg(team) {
    return this.query().insertAndFetch({
      id: team.id,
      name: team.name,
      avatar: team.image_230,
      type: 'slack'
    })
  }

  static async updateSlackOrg(team) {
    return this.query().updateAndFetchById(team.id, {
      name: team.name,
      avatar: team.image_230
    })
  }

  static async createGitHubOrg(org) {
    // TODO:
  }

  static async updateGitHubOrg(org) {
    // TODO:
  }
}

module.exports = Organization
