const can = require('../__utils__/policy-tester')

describe('user policies', () => {
  class User {
    constructor(role) {
      this.id = role
      this.role = role
      this.name = role
      this.deactivated = false
    }
  }
  const user = new User('user')
  const superuser = new User('superuser')

  test('everyone can see each other', () => {
    expect(can(user, 'read', superuser)).toBe(true)
  })

  test.skip('deactivated users cannot sign in', () => {
    //
  })

  test.skip('non-deactivated users can create accounts', () => {
    //
  })

  test('users cannot update their id/role/activation status', () => {
    expect(can(user, 'update', user, { id: '3' })).toBe(false)
    expect(can(user, 'update', user, { deactivated: false })).toBe(false)
  })

  test('users can update their details', () => {
    expect(can(user, 'update', user, { name: 'hullo' })).toBe(true)
  })

  test('superusers can deactivate/deactivate users', () => {
    expect(can(superuser, 'update', user, { name: 'hallo' })).toBe(false)
    expect(
      can(superuser, 'update', user, { role: 'superuser', deactivated: false })
    ).toBe(true)
  })
})
