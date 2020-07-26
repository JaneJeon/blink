const Link = require('./link')
const User = require('./user')
const normalizeUrl = require('normalize-url')
const { ValidationError, UniqueViolationError } = require('objection')

describe('Link', () => {
  const originalUrls = ['www.nodejs.org', 'example.com', 'http://google.com']
  const normalizedUrls = originalUrls.map(url =>
    normalizeUrl(url, { forceHttps: true })
  )

  const links = []
  let user

  beforeAll(async () => {
    user = await User.fromJson({ id: 'admin' })
  })

  it('shortens URL', async () => {
    let link = await user
      .$relatedQuery('links')
      .insert({ originalUrl: originalUrls[0] })
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
      user.$relatedQuery('links').insert({ originalUrl: originalUrls[0] })
    ).rejects.toThrow(UniqueViolationError)
  })

  it('prevents URL redirect loop', async () => {
    await expect(
      user
        .$relatedQuery('links')
        .insert({ originalUrl: process.env.BASE_URL + '/hello' })
    ).rejects.toThrow(ValidationError)
  })

  it('rejects invalid URLs', async () => {
    await expect(
      user.$relatedQuery('links').insert({ originalUrl: '1234 0' })
    ).rejects.toThrow(ValidationError)
  })

  it('rejects valid but nonexistent URLs', async () => {
    await expect(
      user.$relatedQuery('links').insert({ originalUrl: 'www.timeout.com' })
    ).rejects.toThrow(ValidationError)
  })

  const hash = 'FooBar'
  it('can set custom hash', async () => {
    const link = await user.$relatedQuery('links').insert({
      originalUrl: originalUrls[1],
      hash
    })

    expect(link.hash).toEqual(hash)
    expect(link.brandedUrl).toBeDefined()

    links.push(link.toJSON())
  })

  it('prevents duplicate custom hash', async () => {
    await expect(
      user.$relatedQuery('links').insert({ originalUrl: originalUrls[2], hash })
    ).rejects.toThrow(UniqueViolationError)
  })

  it('prevents custom hash that clashes with hashIds', async () => {
    const generatedHash = Link._hashIdInstance.encode(500)
    await expect(
      user
        .$relatedQuery('links')
        .insert({ originalUrl: originalUrls[2], hash: generatedHash })
    ).rejects.toThrow(UniqueViolationError)
  })

  describe('QueryBuilder', () => {
    test('#findByHashId', async () => {
      const [link0, link1] = await Promise.all([
        user.$relatedQuery('links').findByHashId(links[0].id),
        user.$relatedQuery('links').findByHashId(links[1].id)
      ])

      expect(link0.originalUrl).toEqual(links[0].originalUrl)
      expect(link1.originalUrl).toEqual(links[1].originalUrl)
    })
  })
})
