require('../../__utils__/knex-test')
require('../../__utils__/trxify-test')

const supertest = require('supertest')
const app = require('../../app')
const session = supertest.agent(app)

describe('/api/users', () => {
  describe('GET /', () => {
    it('returns a list of users', async () => {
      const { body, status } = await session
        .get('/api/users')
        .set('X-Mock-Role', 'user')
      expect(status).toEqual(200)
      expect(body.map(user => user.id)).toContain('user')
    })
  })

  describe('GET /:id', () => {
    it('returns a specific user', async () => {
      const { status } = await session
        .get('/api/users/superuser')
        .set('X-Mock-Role', 'user')
      expect(status).toEqual(200)
    })
  })

  describe('PUT /:id', () => {
    const base = {
      id: 'user',
      role: 'user',
      name: 'user'
    }

    it('updates user information', async () => {
      const { body, status } = await session
        .put('/api/users/user')
        .send(Object.assign({}, base, { name: 'hello' }))
        .set('X-Mock-Role', 'user')
      expect(status).toEqual(200)
      expect(body.name).toBe('hello')
    })

    it('handles user deactivation', async () => {
      const { body, status } = await session
        .put('/api/users/user')
        .send(Object.assign({}, base, { deactivated: true }))
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(200)
      expect(body.deactivated).toBe(true)
    })

    it('handles user reactivation', async () => {
      const { body, status } = await session
        .put('/api/users/user')
        .send(Object.assign({}, base, { deactivated: false }))
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(200)
      expect(body.deactivated).toBe(false)
    })
  })
})
