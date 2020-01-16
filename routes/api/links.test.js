const supertest = require('supertest')
const app = require('../../app')
const mockSession = require('../../__utils__/mock-session')
const User = require('../../models/user')
const Link = require('../../models/link')

describe('/api/links', () => {
  const session = supertest.agent(app)
  let user, link, cookie

  beforeAll(async () => {
    user = await User.query().insertAndFetch({ id: 'link-test', role: 'owner' })
    cookie = mockSession(user.id)
  })

  describe('POST /', () => {
    test.only('works', async () => {
      const { body, status } = await session
        .post('/api/links', { originalURL: 'nodejs.org' })
        .set('Cookie', cookie)
      link = body
      expect(status).toEqual(201)
    })

    test('handles duplicates', async () => {
      const { body } = await session
        .post('/api/links', { originalURL: 'www.nodejs.org' })
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
