const token = require('./token')
const redis = require('./redis')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('lib/token', () => {
  let tok

  describe('#createToken', () => {
    let shortToken

    test('stores value', async () => {
      tok = await token.createToken(100000, 'hello world!')
      shortToken = await token.createToken(500, 'boo!')

      expect(await redis.get(shortToken)).toBe('boo!')
    })

    test('expires token', async () => {
      await sleep(510)
      expect(await redis.get(shortToken)).toBeNull()
    })
  })

  describe('#consumeToken', () => {
    test('returns stored value', async () => {
      expect(await token.consumeToken(tok)).toBe('hello world!')
    })

    test('deletes used token', async () => {
      expect(await redis.get(tok)).toBeNull()
    })
  })
})
