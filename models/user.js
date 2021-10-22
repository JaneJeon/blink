const BaseModel = require('./base')
const { API_USER_ID } = require('../config/constants')

let user1exists = false

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

  static async defaultRole() {
    // First, check if there are any users currently in the database
    if (user1exists) return 'user'

    // Of course, we need to account for the API user
    const user1 = await this.query().whereNot({ id: API_USER_ID }).first()

    if (!user1) {
      user1exists = true
      return 'superuser'
    } else return 'user'
  }
}

module.exports = User
