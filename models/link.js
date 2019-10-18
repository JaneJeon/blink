const BaseModel = require('./base')
const hashId = require('objection-hashid')
const httpError = require('http-errors')

const { URL } = require('url')
const normalizeURL = require('normalize-url')

class Link extends hashId(BaseModel) {
  static get relationMappings() {
    return {
      user: {
        type: BaseModel.BelongsToOneRelation,
        modelClass: 'user',
        join: {
          from: 'links.creatorId',
          to: 'users.id'
        }
      }
    }
  }

  processInput() {
    if (this.hash) this.hash = this.hash.toLowerCase().trim()
    if (this.originalURL) {
      try {
        // normalize URL so that we can search by URL.
        // The process of normalization also involves validating the (normalized) URL.
        this.originalURL = normalizeURL(this.originalURL, {
          forceHttps: true,
          stripWWW: true
        })

        if (new URL(this.originalURL).host === process.env.DOMAIN)
          throw new Error(`Cannot shorten ${process.env.DOMAIN} URLs`)
      } catch (err) {
        throw httpError(400, err)
      }
    }
  }

  static get virtualAttributes() {
    return ['shortenedURL', 'brandedURL']
  }

  get shortenedURL() {
    return `${process.env.DOMAIN}/${this.hashId}`
  }

  get brandedURL() {
    return `${process.env.DOMAIN}/${this.hash}`
  }

  static get hashIdSalt() {
    return process.env.DOMAIN
  }

  static get hashIdMinLength() {
    return this.jsonSchema.properties.hash.minLength
  }

  static get hashIdAlphabet() {
    return 'abcdefghijklmnopqrstuvwxyz0123456789' // lowercase
  }

  static get QueryBuilder() {
    return class extends super.QueryBuilder {
      // if the hash is encoded, search for the id, else search hash directly
      findByHashId(hash) {
        const ids = this.modelClass()._hashIdInstance.decode(hash)

        return ids.length ? this.findById(ids[0]) : this.findOne({ hash })
      }
    }
  }
}

module.exports = Link
