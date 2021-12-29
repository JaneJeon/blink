require('../../__utils__/trxify-test')

const supertest = require('supertest')
const merge = require('lodash/merge')
const app = require('../../app')
const session = supertest.agent(app)
const User = require('../../models/user')
const apiHeaderGen = require('../../__utils__/bearer-header-gen')

describe('/api/users', () => {
  const TEST_USER_ID = 'user-routes-api-users-test'
  const TEST_SUPERUSER_ID = 'superuser-routes-api-users-test'
  const API_HEADER = apiHeaderGen()

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
      const { body, status } = await session.get('/api/users').set(API_HEADER)
      expect(status).toEqual(200)
      expect(body.map(user => user.id)).toContain(TEST_USER_ID)
    })
  })

  describe('GET /:id', () => {
    it('returns a specific user', async () => {
      const { status } = await session
        .get(`/api/users/${TEST_SUPERUSER_ID}`)
        .set(API_HEADER)
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
        .send(merge({}, base, { name: 'hello' }))
        .set('X-Mock-Role', 'user')
        .set('X-Mock-Id', TEST_USER_ID)
      expect(status).toEqual(200)
      expect(body.name).toBe('hello')
      expect(body.createdAt).toBeTruthy()
      expect(body.updatedAt).toBeTruthy()
    })

    it('handles user deactivation', async () => {
      const FULL_SCOPE_API_HEADER = apiHeaderGen({ scope: 'user:*' })

      const { body, status } = await session
        .put(`/api/users/${TEST_USER_ID}`)
        .send(merge({}, base, { deactivated: true }))
        .set(FULL_SCOPE_API_HEADER)
      expect(status).toEqual(200)
      expect(body.deactivated).toBe(true)
    })

    it('handles user reactivation', async () => {
      const { body, status } = await session
        .put(`/api/users/${TEST_USER_ID}`)
        .send(merge({}, base, { deactivated: false }))
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(200)
      expect(body.deactivated).toBe(false)
    })
  })
})
