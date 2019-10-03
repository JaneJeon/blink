const request = require('supertest')
const app = require('../app')
const Link = require('../models/link')

describe('/', () => {
  const originalURL = 'medium.com'
  const _id = 'www_Test1'

  beforeAll(async () => {
    await Link.deleteOne({ originalURL })
    await Link.create({ originalURL, _id })
  })

  test('GET /', done => {
    request(app)
      .get('/')
      .expect(301, done)
  })

  test('GET /:id', done => {
    request(app)
      .get(`/${_id}`)
      .expect(301, done)
  })
})
