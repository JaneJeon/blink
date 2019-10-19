const Link = require('./link')
const hashIds = Link._hashIdInstance

describe('Link', () => {
  const originalURL = 'www.nodejs.org'
  const normalizedURL = 'https://nodejs.org'
  const originalURL2 = 'example.com'
  const originalURL3 = 'www.google.com'
  let id

  beforeAll(async () => {
    await Link.deleteMany()
  })

  test('shorten URL', async () => {
    const doc = await Link.create({ originalURL })
    id = doc.id

    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThanOrEqual(process.env.HASH_MIN_LENGTH - 0)
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
    const doc = await Link.findOne().byLowerId(id)

    expect(doc.originalURL).toBe(normalizedURL)
    expect(doc.brandedURL.startsWith(process.env.BASE_URL)).toBe(true)
  })

  test('set custom hash (which is lowercased)', async () => {
    let error
    try {
      await Link.create({ originalURL: originalURL2, _id: hashIds.encode(500) })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }

    const link = await Link.create({ originalURL: originalURL2, _id: 'FooBar' })
    expect(link.id).toBe('foobar')
  })

  test.skip('preserve hashes corresponding to public folders', async () => {
    let error
    try {
      await Link.create({ originalURL: originalURL3, _id: '_test' })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }
  })

  test.skip('preserve hashes corresponding to static redirects', async () => {
    let error
    try {
      await Link.create({ originalURL: originalURL3, _id: 'login' })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }
  })
})
