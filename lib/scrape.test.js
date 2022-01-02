require('../__utils__/mock-http-requests')

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

  it('times out when URL cannot be resolved', async () => {
    await expect(scrape('www.timeout.com')).rejects.toThrow()
  })
})
