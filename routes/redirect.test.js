const request = require('supertest')
const app = require('../app')
const Link = require('../models/link')
const User = require('../models/user')

describe('/', () => {
  const originalURL = 'medium.com'
  const hash = 'HeLlOwOrLd'

  beforeAll(async () => {
    const id = 'redirectUser'
    await Link.query()
      .delete()
      .where({ originalURL })
      .orWhere({ creatorId: id })
    await User.query().delete().where({ id })
    const user = await User.query().insert({ id })
    await user.$relatedQuery('links').insert({ originalURL, hash })
  })

  test('GET /', done => {
    request(app).get('/').expect(301, done)
  })

  test('GET /:id', done => {
    request(app).get(`/${hash}`).expect(301, done)
  })
})
