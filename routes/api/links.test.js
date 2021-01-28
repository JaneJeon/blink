require('../../__utils__/knex-test')

const supertest = require('supertest')
const app = require('../../app')
const session = supertest.agent(app)

describe('/api/links', () => {
  let link

  describe('POST /', () => {
    it('works', async () => {
      const { body, status } = await session
        .post('/api/links')
        .send({ originalUrl: 'js.org' })
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(201)
      link = body
    })

    it('handles duplicates', async () => {
      const { body } = await session
        .post('/api/links')
        .send({ originalUrl: 'www.js.org' })
        .set('X-Mock-Role', 'superuser')
      expect(body).toEqual(link)
    })
  })

  describe('GET /', () => {
    it('works', async () => {
      const { body, status } = await session
        .get('/api/links')
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(200)
      expect(body.map(link => link.id)).toContain(link.id)
    })
  })

  describe('GET /:id', () => {
    it('works', async () => {
      const { body, status } = await session
        .get(`/api/links/${link.id}`)
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(200)
      expect(body).toEqual(link)
    })
  })

  describe('PUT /:id', () => {
    it('works', async () => {
      const { body, status } = await session
        .put(`/api/links/${link.id}`)
        .send({ originalUrl: 'js.org', hash: 'foobar' })
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(200)
      expect(body.hash).toBe('foobar')
    })
  })

  describe('DELETE /:id', () => {
    it('works', async () => {
      const { status } = await session
        .delete(`/api/links/${link.id}`)
        .set('X-Mock-Role', 'superuser')
      expect(status).toEqual(204)
    })
  })
})
