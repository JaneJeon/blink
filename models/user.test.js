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

  describe('QueryBuilder', () => {
    test('#filterDeleted', async () => {
      let [defaultUsers, deletedUsers] = await Promise.all([
        User.query().filterDeleted(),
        User.query().filterDeleted(true)
      ])
      defaultUsers = defaultUsers.map(user => user.id)
      deletedUsers = deletedUsers.map(user => user.id)

      expect(defaultUsers).toContain('notDeletedUser')
      expect(defaultUsers.includes('deletedUser')).toBe(false)
      expect(deletedUsers).toContain('deletedUser')
      expect(deletedUsers.includes('notDeletedUser')).toBe(false)
    })
  })
})
