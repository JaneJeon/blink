const policyTester = require('../test-utils/policy-tester')

describe('user policy', () => {
  let i = 0
  class User {
    constructor({ role, deleted = false }) {
      this.id = i++
      this.role = role
      this.deleted = deleted
    }
  }

  const user = new User({ role: 'user' })
  const deletedUser = new User({ role: 'user', deleted: true })
  const admin = new User({ role: 'admin' })
  const owner = new User({ role: 'owner' })

  describe('users', () => {
    const self = new User({ role: 'user' })
    const { can, cannot } = policyTester(self, 'User')

    test('can read other users', () => {
      can('read', user)
    })

    test('can update only itself', () => {
      cannot('update', user)
      can('update', self)
    })

    test('cannot update certain fields', () => {
      cannot('update', self, 'id')
      cannot('update', self, 'role')
      cannot('update', self, 'deleted')
    })

    test('can delete itself with explicit confirmation', () => {
      cannot('delete', self)
      can('delete', self, undefined, { confirm: true })
      cannot('delete', user, undefined, { confirm: true })
    })

    test('cannot recover accounts once deleted', () => {
      cannot('undelete', self)
    })
  })

  describe('admins', () => {
    const self = new User({ role: 'admin' })
    const { can, cannot } = policyTester(self, 'User')

    test('can promote a user to admin status', () => {
      cannot('update', user, 'role', { role: 'owner' })
      cannot('update', admin, 'role', { role: 'user' })
      can('update', user, 'role', { role: 'admin' })
    })

    test('can recuse themselves', () => {
      cannot('update', self, 'role', { role: 'owner' })
      can('update', self, 'role', { role: 'user' })
    })

    test('can delete a regular user', () => {
      can('delete', user, undefined, { confirm: true })
      cannot('delete', admin, undefined, { confirm: true })
    })

    test('can recover deleted accounts', () => {
      can('undelete', deletedUser)
    })
  })

  describe('owners', () => {
    const self = new User({ role: 'owner' })
    const { can, cannot } = policyTester(self, 'User')

    test('can promote/demote any user', () => {
      can('update', admin, 'role', { role: 'owner' })
      can('update', admin, 'role', { role: 'user' })
      can('update', owner, 'role', { role: 'user' })
    })

    test('can delete anyone', () => {
      can('delete', admin, undefined, { confirm: true })
      can('delete', owner, undefined, { confirm: true })
    })

    test('cannot update deleted users. Nobody can.', () => {
      cannot('update', deletedUser, 'role', { role: 'admin' })
    })
  })
})
