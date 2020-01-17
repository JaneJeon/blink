const policyTester = require('../__utils__/policy-tester')

describe('link policy', () => {
  class Link {
    // creatorId, meta, hash
    constructor(opts) {
      Object.assign(this, opts)
    }
  }

  describe('users', () => {
    const self = { role: 'user', id: 1 }
    const { can, cannot } = policyTester(self, 'Link')

    test('can read any links', () => {
      can('read', new Link({ creatorId: 0 }))
    })

    test('can update metadata for their link', () => {
      can('update', new Link({ creatorId: 1 }), 'meta')
      cannot('update', new Link({ creatorId: 0 }), 'meta')
    })

    test("can add a hash, but can't change it", () => {
      can('update', new Link({ creatorId: 1 }), 'hash')
      cannot('update', new Link({ creatorId: 1, hash: 'exists' }), 'hash')
    })

    test('cannot delete links', () => {
      cannot('delete')
    })
  })

  describe('owners', () => {
    const self = { role: 'owner', id: 2 }
    const { can } = policyTester(self, 'Link')

    test('can delete links', () => {
      can('delete')
    })
  })
})
