const slack = require('./slack')

describe('lib/slack', () => {
  describe('#largestIcon', () => {
    it('fetches largest icon from an object', () => {
      const obj = {
        name: 'hello',
        avatar: 'https://blahblah',
        image_default: true,
        image_32: 32,
        image_64: 64,
        image_128: 128
      }

      expect(slack.largestIcon(obj)).toBe(128)
    })

    it("doesn't break when there's no images", () => {
      const obj = {
        name: 'hello',
        avatar: 'https://blahblah',
        image_default: true
      }

      expect(slack.largestIcon(obj)).toBeUndefined()
    })

    it("doesn't break when there's no object", () => {
      expect(slack.largestIcon()).toBeUndefined()
    })
  })
})
