const supertest = require('supertest')
const app = require('../../app')
const mockSession = require('../../__utils__/mock-user-session')
const session = supertest.agent(app)
const cookie = mockSession('owner')

describe('/api/links', () => {
  let link

  describe('POST /', () => {
    it('works', async () => {
      const { body, status } = await session
        .post('/api/links')
        .send({ originalUrl: 'js.org' })
        .set('Cookie', cookie)
      expect(status).toEqual(201)
      link = body
    })

    it('handles duplicates', async () => {
      const { body } = await session
        .post('/api/links')
        .send({ originalUrl: 'www.js.org' })
        .set('Cookie', cookie)
      expect(body).toEqual(link)
    })
  })

  describe('GET /', () => {
    it('works', async () => {
      const { body, status } = await session
        .get('/api/links')
        .set('Cookie', cookie)
      expect(status).toEqual(200)
      expect(body.map(link => link.id)).toContain(link.id)
    })
  })

  describe('GET /:id', () => {
    it('works', async () => {
      const { body, status } = await session
        .get(`/api/links/${link.id}`)
        .set('Cookie', cookie)
      expect(status).toEqual(200)
      expect(body).toEqual(link)
    })
  })

  describe('PATCH /:id', () => {
    it('works', async () => {
      const { body, status } = await session
        .patch(`/api/links/${link.id}`)
        .send({ hash: 'foobar' })
        .set('Cookie', cookie)
      expect(status).toEqual(200)
      expect(body.hash).toBe('foobar')
    })
  })

  describe('DELETE /:id', () => {
    it('works', async () => {
      const { status } = await session
        .delete(`/api/links/${link.id}`)
        .set('Cookie', cookie)
      expect(status).toEqual(204)
    })
  })
})
