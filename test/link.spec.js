require('dotenv').config()
const Link = require('../models/link')

describe('Link model', () => {
  const url = 'www.nodejs.org'
  const normalizedURL = 'https://nodejs.org'
  let id

  beforeAll(async () => {
    return Link.deleteMany({})
  })

  test('shorten URL', async () => {
    const link = new Link({ url })
    const doc = await link.save()
    id = doc.id

    expect(doc.id).toBeDefined()
    expect(typeof doc.id).toBe('string')
    expect(doc.id.length).toBeGreaterThanOrEqual(6)
  })

  test('fetch URL', async () => {
    const doc = await Link.findByHashId(id)

    expect(doc.url).toBe(normalizedURL)
  })
})
