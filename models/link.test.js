const Link = require('./link')
const HashIds = require('hashids/cjs')
const hashIds = new HashIds(process.env.DOMAIN, process.env.HASH_MIN_LENGTH - 0)

describe('Link', () => {
  const originalURL = 'www.nodejs.org'
  const originalURL2 = 'example.com'
  const normalizedURL = 'https://nodejs.org'
  // const normalizedURL2 = 'https://example.com'
  let id

  beforeAll(async () => {
    await Link.deleteMany()
  })

  test('shorten URL', async () => {
    const doc = await Link.create({ originalURL })
    id = doc.id

    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThanOrEqual(6)
  })

  test('prevent duplicate URLs', async () => {
    let error
    try {
      await Link.create({ originalURL })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }
  })

  test('fetch URL', async () => {
    const doc = await Link.findById(id)

    expect(doc.originalURL).toBe(normalizedURL)
    expect(doc.brandedURL.startsWith(process.env.DOMAIN)).toBe(true)
  })

  test('set custom hash', async () => {
    let error
    try {
      await Link.create({ originalURL: originalURL2, _id: hashIds.encode(500) })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }

    await Link.create({ originalURL: originalURL2, _id: 'FooBar' })
  })
})
