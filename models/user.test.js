require('../__utils__/knex-test')
require('../__utils__/trxify-test')

const User = require('./user')

describe('User model', () => {
  test('the first non-API user gets elevated default role', async () => {
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
