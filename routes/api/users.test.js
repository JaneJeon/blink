require('../../__utils__/knex-test')
require('../../__utils__/trxify-test')

const supertest = require('supertest')
const app = require('../../app')
const session = supertest.agent(app)
const User = require('../../models/user')

describe('/api/users', () => {
  const TEST_USER_ID = 'user-routes-api-users-test'
  const TEST_SUPERUSER_ID = 'superuser-routes-api-users-test'

  beforeAll(async () => {
    await User.query().findByIds([TEST_SUPERUSER_ID, TEST_USER_ID]).delete()
    await User.query().insert([
      {
        id: TEST_SUPERUSER_ID,
        role: 'superuser',
        name: 'superuser',
        deactivated: false
      },
      {
        id: TEST_USER_ID,
        role: 'user',
        name: 'user',
        deactivated: false
      }
    ])
  })

  describe('GET /', () => {
    it('returns a list of users', async () => {
      const { body, status } = await session
        .get('/api/users')
        .set('X-Mock-Role', 'user')
        .set('X-Mock-Id', TEST_USER_ID)
      expect(status).toEqual(200)
      expect(body.map(user => user.id)).toContain(TEST_USER_ID)
    })
  })

  describe('GET /:id', () => {
    it('returns a specific user', async () => {
      const { status } = await session
        .get(`/api/users/${TEST_SUPERUSER_ID}`)
        .set('X-Mock-Role', 'user')
        .set('X-Mock-Id', TEST_USER_ID)
      expect(status).toEqual(200)
    })
  })

  describe('PUT /:id', () => {
    const base = {
      id: TEST_USER_ID,
      role: 'user',
      name: 'user',
      deactivated: false
    }

    it('updates user information', async () => {
      const { body, status } = await session
        .put(`/api/users/${TEST_USER_ID}`)
        .send(Object.assign({}, base, { name: 'hello' }))
        .set('X-Mock-Role', 'user')
        .set('X-Mock-Id', TEST_USER_ID)
      expect(status).toEqual(200)
      expect(body.name).toBe('hello')
    })

    it('handles user deactivation', async () => {
      const { body, status } = await session
        .put(`/api/users/${TEST_USER_ID}`)
        .send(Object.assign({}, base, { deactivated: true }))
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(200)
      expect(body.deactivated).toBe(true)
    })

    it('handles user reactivation', async () => {
      const { body, status } = await session
        .put(`/api/users/${TEST_USER_ID}`)
        .send(Object.assign({}, base, { deactivated: false }))
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(200)
      expect(body.deactivated).toBe(false)
    })
  })
})
