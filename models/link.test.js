require('../__utils__/knex-test')

const User = require('./user')
const Link = require('./link')
const normalizeUrl = require('normalize-url')
const { ValidationError, UniqueViolationError } = require('objection')

describe('Link', () => {
  const TEST_SUPERUSER_ID = 'superuser-model-link-test'

  beforeAll(async () => {
    await User.query().findById(TEST_SUPERUSER_ID).delete()
    await User.query().insert({
      id: TEST_SUPERUSER_ID,
      role: 'superuser',
      name: 'superuser',
      deactivated: false
    })
  })

  const originalUrls = ['www.nodejs.org', 'example.com', 'http://google.com']
  const normalizedUrls = originalUrls.map(url =>
    normalizeUrl(url, { forceHttps: true })
  )

  const links = []
  const user = { id: TEST_SUPERUSER_ID, role: 'superuser' }

  it('shortens URL', async () => {
    let link = await Link.query().insert({
      originalUrl: originalUrls[0],
      creatorId: user.id
    })
    link = link.toJSON()
    links.push(link)

    expect(typeof link.id).toBe('string')
    expect(link.id.length).toBeGreaterThanOrEqual(
      Link.jsonSchema.properties.hash.minLength
    )

    expect(link.originalUrl).toEqual(normalizedUrls[0])
    expect(link.shortenedUrl).toBeDefined()
    expect(link.brandedUrl).toBeUndefined()
    expect(link.meta).toBeDefined()
  })

  it('prevents duplicate URLs', async () => {
    await expect(
      Link.query().insert({ originalUrl: originalUrls[0], creatorId: user.id })
    ).rejects.toThrow(UniqueViolationError)
  })

  it('prevents URL redirect loop', async () => {
    await expect(
      Link.query().insert({
        originalUrl: process.env.BASE_URL + '/hello',
        creatorId: user.id
      })
    ).rejects.toThrow(ValidationError)
  })

  it('rejects invalid URLs', async () => {
    await expect(
      Link.query().insert({ originalUrl: '1234 0', creatorId: user.id })
    ).rejects.toThrow(ValidationError)
  })

  it('rejects valid but nonexistent URLs', async () => {
    await expect(
      Link.query().insert({
        originalUrl: 'www.timeout.com',
        creatorId: user.id
      })
    ).rejects.toThrow()
  })

  const hash = 'FooBar'
  it('can set custom hash', async () => {
    const link = await Link.query().insert({
      originalUrl: originalUrls[1],
      hash,
      creatorId: user.id
    })

    expect(link.hash).toEqual(hash)
    expect(link.brandedUrl).toBeDefined()

    links.push(link.toJSON())
  })

  it('prevents duplicate custom hash', async () => {
    await expect(
      Link.query().insert({
        originalUrl: originalUrls[2],
        hash,
        creatorId: user.id
      })
    ).rejects.toThrow(UniqueViolationError)
  })

  it('prevents custom hash that clashes with hashIds', async () => {
    const generatedHash = Link._hashIdInstance.encode(500)
    await expect(
      Link.query().insert({
        originalUrl: originalUrls[2],
        hash: generatedHash,
        creatorId: user.id
      })
    ).rejects.toThrow(ValidationError)
  })

  describe('QueryBuilder', () => {
    test('#findByHashId', async () => {
      const [link0, link1] = await Promise.all([
        Link.query().findByHashId(links[0].id),
        Link.query().findByHashId(links[1].id)
      ])

      expect(link0.originalUrl).toEqual(links[0].originalUrl)
      expect(link1.originalUrl).toEqual(links[1].originalUrl)
    })
  })
})
