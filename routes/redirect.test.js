require('../__utils__/knex-test')
require('../__utils__/trxify-test')

const request = require('supertest')
const app = require('../app')
const Link = require('../models/link')

describe('/', () => {
  const originalUrl = 'redirect-test.com'
  const hash = 'redirectTest'

  beforeAll(async () => {
    await Link.query().delete().where({ originalUrl })
    await Link.query().insert({ originalUrl, hash, creatorId: 'test user' })
  })

  test('GET /', done => {
    request(app).get('/').expect(301, done)
  })

  test('GET /:id', done => {
    request(app).get(`/${hash}`).expect(301, done)
  })
})
