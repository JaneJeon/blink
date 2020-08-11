const User = require('./user')

describe('User', () => {
  beforeAll(async () => {
    await User.query().insert([
      { id: 'deletedUser', deleted: true },
      { id: 'notDeletedUser' }
    ])
  })

  afterAll(async () => {
    await User.knex().destroy()
  })
})
