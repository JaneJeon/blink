const { verify } = require('./scope')

describe('OAuth scope matcher', () => {
  it('matches from a "list" of scopes', () => {
    expect(verify('', '')).toBe(true)
    expect(verify('', '')).toBe(false)
  })

  it('expands wildcard', () => {
    //
  })
})
