const normalizeUrl = require('normalize-url')
const HashIds = require('hashids/cjs')
const hash = new HashIds(process.env.HASH_SALT, process.env.HASH_MIN_LENGTH - 0)

class Link {
  constructor(link) {
    this.url = normalizeUrl(link, { stripProtocol: true })
  }

  async exists() {
    // TODO: check if this link exists
  }

  async save() {
    // TODO: fetch next ID
    hash.encode(1)
  }
}

module.exports = Link
