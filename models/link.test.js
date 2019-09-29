require('dotenv-defaults').config()

const Link = require('./link')
const HashIds = require('hashids/cjs')
const hashIds = new HashIds(process.env.DOMAIN, process.env.HASH_MIN_LENGTH - 0)

describe('Link model', () => {
  const url = 'www.nodejs.org'
  const url2 = 'example.com'
  const normalizedURL = 'https://nodejs.org'
  const normalizedURL2 = 'https://example.com'
  let hash

  beforeAll(async () => {
    await Link.deleteMany({ url: { $in: [normalizedURL, normalizedURL2] } })
  })

  test('shorten URL', async () => {
    const doc = await Link.create({ url })
    hash = doc.hash

    expect(typeof doc.hash).toBe('string')
    expect(doc.hash.length).toBeGreaterThanOrEqual(6)
  })

  test('prevent duplicate URLs', async () => {
    let error
    try {
      await Link.create({ url })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }
  })

  test('fetch URL', async () => {
    const doc = await Link.findOne({ hash })

    expect(doc.url).toBe(normalizedURL)
    expect(doc.redirectTo.startsWith(process.env.DOMAIN)).toBe(true)
  })

  test('set custom hash', async () => {
    let error
    try {
      await Link.create({ url: url2, hash: hashIds.encode(500) })
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeDefined()
    }

    await Link.create({ url: url2, hash: 'FooBar' })
  })
})
