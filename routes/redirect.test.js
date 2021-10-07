require('../__utils__/knex-test')
require('../__utils__/trxify-test')

const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Link = require('../models/link')

describe('/', () => {
  const originalUrl = 'redirect-test.com'
  const hash = 'redirectTest'
  const TEST_USER_ID = 'user-routes-redirect-test'

  beforeAll(async () => {
    await User.query().findById(TEST_USER_ID).delete()
    await User.query().insert({
      id: TEST_USER_ID,
      role: 'user',
      name: 'user',
      deactivated: false
    })
    await Link.query().insert({ originalUrl, hash, creatorId: TEST_USER_ID })
  })

  test('GET /', done => {
    request(app).get('/').expect(301, done)
  })

  test('GET /:id', done => {
    request(app).get(`/${hash}`).expect(301, done)
  })
})
