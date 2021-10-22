require('../__utils__/knex-test')
require('../__utils__/trxify-test')

const User = require('./user')
const { API_USER_ID } = require('../config/constants')

describe('User model', () => {
  test('the first non-API user gets elevated default role', async () => {
    await User.query().whereNot({ id: API_USER_ID }).delete()

    // By the time we do the tests, the DB is already seeded with the API "user"
    const role1 = await User.defaultRole()
    expect(role1).toBe('superuser')

    await User.query().insert({
      id: 'user-model-test-first',
      role: role1,
      name: 'test'
    })

    const role2 = await User.defaultRole()
    expect(role2).toBe('user')
  })
})
