require('../../__utils__/knex-test')
const merge = require('lodash/merge')

const supertest = require('supertest')
const app = require('../../app')
const session = supertest.agent(app)
const User = require('../../models/user')

describe('/api/links', () => {
  let link
  const TEST_SUPERUSER_ID = 'superuser-routes-links-api-test'

  beforeAll(async () => {
    await User.query().findById(TEST_SUPERUSER_ID).delete()
    await User.query().insert({
      id: TEST_SUPERUSER_ID,
      role: 'superuser',
      name: 'superuser',
      deactivated: false
    })
  })

  describe('POST /', () => {
    it('"creates"/shortens link', async () => {
      const { body, status } = await session
        .post('/api/links')
        .send({ originalUrl: 'js.org' })
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(201)
      link = body
    })

    it('handles duplicates', async () => {
      const { body } = await session
        .post('/api/links')
        .send({ originalUrl: 'www.js.org' })
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(body).toEqual(link)
    })
  })

  describe('GET /', () => {
    it('returns links (paginated)', async () => {
      const { body, status } = await session
        .get('/api/links')
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(200)
      expect(body.map(link => link.id)).toContain(link.id)
    })
  })

  describe('GET /:id', () => {
    it('returns a specific link', async () => {
      const { body, status } = await session
        .get(`/api/links/${link.id}`)
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(200)
      expect(body).toEqual(link)
    })
  })

  describe('PUT /:id', () => {
    it('updates a link', async () => {
      const { body, status } = await session
        .put(`/api/links/${link.id}`)
        .send(merge({}, link, { hash: 'foobar' }))
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(200)
      expect(body.hash).toBe('foobar')
    })
  })

  describe('DELETE /:id', () => {
    it('deletes a link (with admin approval)', async () => {
      const { status } = await session
        .delete(`/api/links/${link.id}`)
        .set('X-Mock-Role', 'superuser')
        .set('X-Mock-Id', TEST_SUPERUSER_ID)
      expect(status).toEqual(204)
    })
  })
})
