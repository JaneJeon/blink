require('../__utils__/knex-test')
const request = require('supertest')
const app = require('../app')
const Link = require('../models/link')
const User = require('../models/user')

describe('/', () => {
  const originalUrl = 'medium.com'
  const hash = 'HeLlOwOrLd' // =3

  beforeAll(async () => {
    const id = 'redirectUser'
    await Link.query()
      .delete()
      .where({ originalUrl })
      .orWhere({ creatorId: id })
    await User.query().delete().where({ id })
    const user = await User.query().insert({ id })
    await user.$relatedQuery('links').insert({ originalUrl, hash })
  })

  test('GET /', done => {
    request(app).get('/').expect(301, done)
  })

  test('GET /:id', done => {
    request(app).get(`/${hash}`).expect(301, done)
  })
})
