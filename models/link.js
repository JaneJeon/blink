const mongoose = require('../lib/mongoose')
const Sequence = require('./sequence')

const { URL } = require('url')
const normalizeUrl = require('normalize-url')
const HashIds = require('hashids/cjs')
const hash = new HashIds(process.env.DOMAIN, process.env.HASH_MIN_LENGTH - 0)

const schema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: process.env.URL_MAX_LENGTH,
      immutable: true,
      validate: {
        validator: url => new URL(url).host !== process.env.DOMAIN,
        msg: `Cannot shorten ${process.env.DOMAIN} URLs`
      },
      set: url => normalizeUrl(url, { forceHttps: true })
    },
    hash: {
      hide: true,
      type: String,
      unique: true,
      trim: true,
      minlength: process.env.HASH_MIN_LENGTH,
      maxlength: process.env.HASH_MAX_LENGTH,
      match: /^\w+$/,
      immutable: true,
      validate: {
        validator: val => !hash.decode(val).length,
        msg: 'Cannot use this hash'
      }
    },
    creator: {
      hide: true,
      type: mongoose.Schema.Types.ObjectId,
      immutable: true,
      index: true
    }
  },
  { toJSON: { virtuals: true }, timestamps: true }
)

schema.pre('save', async function() {
  if (!this.hash) this.hash = hash.encode(await Sequence.next())
})
schema.virtual('redirectTo').get(function() {
  return `${process.env.DOMAIN}/${this.hash}`
})

module.exports = mongoose.model('Link', schema)
