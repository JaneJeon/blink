const Sequence = require('./sequence')

describe('Sequence', () => {
  beforeAll(async () => {
    await Sequence.deleteMany()
  })

  let val
  test("works when there's no document", async () => {
    val = await Sequence.next()
    expect(val).toBeGreaterThan(0)
  })

  test('increments', async () => {
    expect(await Sequence.next()).toBeGreaterThan(val)
  })
})
