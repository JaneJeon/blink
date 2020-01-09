const acl = require('../lib/acl')

describe('acl', () => {
  beforeAll(async () => {
    await acl.initialize()
  })

  describe('a user can', () => {
    test('see other users', async () => {
      //
    })

    test('update only itself', async () => {
      //
    })

    test('delete only itself, with explicit confirmation', async () => {
      //
    })

    test('create a link', async () => {
      //
    })

    test('read any link', async () => {
      //
    })

    // TODO: check if hash is supposed to be null or undefined
    test('update its link', async () => {
      //
    })
  })

  describe('an admin can', () => {
    test('promote a user to admin status', async () => {
      //
    })

    test('delete a user', async () => {
      //
    })

    test('re-enable deleted accounts', async () => {
      //
    })
  })

  describe('an owner can', () => {
    //
  })
})
