const request = require('supertest')
const app = require('../../app')
const User = require('../../models/user')

describe.skip('/api/users', () => {
  const id = 'userRouteTest'

  beforeAll(async () => {
    await User.query().insert({ id })
  })

  test('GET /', done => {
    request(app).get('/api/users').expect(200, done)
  })

  test('GET /:id', done => {
    request(app).get(`/api/users/${id}`).expect(200, done)
  })

  describe('GET /:id/links', () => {
    //
  })

  describe('PATCH /:id', () => {
    //
  })
})
