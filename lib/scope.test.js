const { verify } = require('./scope')

describe('OAuth scope matcher', () => {
  it('matches from a "list" of scopes', () => {
    expect(verify('a:b a:c a a:d', 'a:b')).toBe(true)
    expect(verify('a:b a:c a:d', 'a')).toBe(false)
  })

  it('expands wildcard', () => {
    expect(verify('a:b a:c a:*', 'a:e')).toBe(true)
    expect(verify('a:b a:c a:*', 'a:e:d')).toBe(false)
  })
})
