const scrape = require('./scrape')

describe('lib/scrape', () => {
  it('returns link metadata', async () => {
    const metadata = await scrape('https://google.com')
    expect(metadata).toHaveProperty('author')
    expect(metadata).toHaveProperty('date')
    expect(metadata).toHaveProperty('description')
    expect(metadata).toHaveProperty('lang')
    expect(metadata).toHaveProperty('logo')
    expect(metadata).toHaveProperty('publisher')
    expect(metadata).toHaveProperty('title')
  })

  it('throws if the link is broken', async () => {
    let err
    try {
      await scrape('https://googlé.com')
    } catch (error) {
      err = error
    } finally {
      expect(err).toBeDefined()
    }
  })
})
