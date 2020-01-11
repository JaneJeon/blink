const app = require('../../app')
const supertest = require('supertest-session')
// const Link = require('../../models/link')

describe('/api/links', () => {
  const request = supertest(app)

  beforeAll(async () => {
    await app.initialize()
  })

  test.only('POST /', async () => {
    await request.post('/api/links', {
      //
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
