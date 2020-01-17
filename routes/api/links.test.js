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
        .send({ originalURL: 'js.org' })
        .set('Cookie', cookie)
      expect(status).toEqual(201)
      link = body
    })

    it('handles duplicates', async () => {
      const { body } = await session
        .post('/api/links')
        .send({ originalURL: 'www.js.org' })
        .set('Cookie', cookie)
      expect(body).toEqual(link)
    })
  })

  test('GET /', async () => {
    const { body, status } = await session
      .get('/api/links')
      .set('Cookie', cookie)
    expect(status).toEqual(200)
    expect(body).toContain(link)
  })

  test('GET /:id', async () => {
    const { body, status } = await session
      .get(`/api/links/${link.id}`)
      .set('Cookie', cookie)
    expect(status).toEqual(200)
    expect(body).toEqual(link)
  })

  test('PATCH /', async () => {
    const { body, status } = await session
      .patch(`/api/links/${link.id}`)
      .send({})
      .set('Cookie', cookie)
    expect(status).toEqual(200)
    expect(body) // TODO:
  })

  test('DELETE /:id', async () => {
    const { status } = await session
      .delete(`/api/links/${link.id}`)
      .set('Cookie', cookie)
    expect(status).toEqual(204)
  })
})
