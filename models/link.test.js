require('dotenv-defaults').config()

const Link = require('./link')
const HashIds = require('hashids/cjs')
const hashIds = new HashIds(process.env.DOMAIN, process.env.HASH_MIN_LENGTH - 0)

describe('Link model', () => {
  const url = 'www.nodejs.org'
  const normalizedURL = 'https://nodejs.org'
  let hash

  beforeAll(async () => {
    return Link.deleteMany({})
  })

  test('shorten URL', async () => {
    const doc = await Link.create({ url })
    hash = doc.hash

    expect(typeof doc.hash).toBe('string')
    expect(doc.hash.length).toBeGreaterThanOrEqual(6)
  })

  test('fetch URL', async () => {
    const doc = await Link.findOne({ hash })

    expect(doc.url).toBe(normalizedURL)
    expect(doc.redirectTo.startsWith(process.env.DOMAIN)).toBe(true)
  })

  test('set custom hash', async () => {
    await Link.create({ url: 'example.com', hash: 'FooBar' })

    // eslint-disable-next-line no-unused-expressions
    expect(new Link({ url, hash: hashIds.encode(500) }).validate()).rejects
  })
})
