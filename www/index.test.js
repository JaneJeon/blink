const request = require('supertest')
const app = require('.')
const Link = require('../models/link')

describe('www', () => {
  const url = 'medium.com'
  const hash = 'www_Test1'

  beforeAll(async () => {
    await Link.deleteOne({ url })
    await Link.create({ url, hash })
  })

  test('GET /', done => {
    request(app)
      .get('/')
      .expect(200, done)
  })

  test('GET /:hash', done => {
    request(app)
      .get(`/${hash}`)
      .expect(200, done)
  })
})
