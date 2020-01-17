const supertest = require('supertest')
const app = require('../../app')
const mockSession = require('../../__utils__/mock-user-session')
const session = supertest.agent(app)
const cookie = mockSession('owner')

describe('/api/links', () => {
  let link

  describe('POST /', () => {
    test('works', async () => {
      const { body, status } = await session
        .post('/api/links')
        .send({ originalURL: 'nodejs.org' })
        .set('Cookie', cookie)
      expect(status).toEqual(201)
      link = body
    })

    test('handles duplicates', async () => {
      const { body } = await session
        .post('/api/links')
        .send({ originalURL: 'www.nodejs.org' })
        .set('Cookie', cookie)
      expect(body).toEqual(link)
    })
  })

  test('GET /', async () => {
    //
  })

  test('GET /:id', async () => {
    //
  })

  test('PATCH /', async () => {
    //
  })

  test('DELETE /:id', async () => {
    //
  })
})
