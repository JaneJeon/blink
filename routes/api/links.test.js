const app = require('../../app')
const supertest = require('supertest-session')
const User = require('../../models/user')
const Link = require('../../models/link')

describe('/api/links', () => {
  let user, link, request

  beforeAll(async () => {
    await app.initialize()
    user = await User.query().insertAndFetch({ id: 'link-test', role: 'owner' })

    request = supertest(app)
  })

  describe('POST /', () => {
    test('works', async () => {
      const { body, status } = await request.post('/api/links', {
        originalURL: 'nodejs.org'
      })
      link = body
      expect(status).toEqual(201)
    })

    test('handles duplicates', async () => {
      const { body } = await request.post('/api/links', {
        originalURL: 'www.nodejs.org'
      })
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
