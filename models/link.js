const mongoose = require('../lib/mongoose')
const Sequence = require('./sequence')
const { URL } = require('url')
const normalizeURL = require('normalize-url')
const HashIds = require('hashids/cjs')
const hash = new HashIds(
  process.env.DOMAIN,
  process.env.HASH_MIN_LENGTH - 0,
  process.env.HASH_ALPHABET
)

const schema = new mongoose.Schema(
  {
    _id: {
      hide: true,
      type: String,
      trim: true,
      lowercase: true,
      minlength: process.env.HASH_MIN_LENGTH,
      maxlength: process.env.HASH_MAX_LENGTH,
      match: /^\w+$/,
      validate: [
        {
          validator: val => !hash.decode(val).length,
          msg: 'Cannot use this hash'
        }
        // {
        //   validator: url => !preservedURLs.includes(url),
        //   msg: 'This URL is preserved'
        // }
      ]
    },
    originalURL: {
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
      set: url => normalizeURL(url, { forceHttps: true })
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      immutable: true,
      index: true,
      ref: 'User'
      // required: true
    }
  },
  { _id: false, toJSON: { virtuals: true }, timestamps: true }
)

schema.pre('save', async function() {
  if (!this.id) this._id = hash.encode(await Sequence.next())
})
schema.virtual('brandedURL').get(function() {
  return `${process.env.DOMAIN}/${this.id}`
})

module.exports = mongoose.model('Link', schema)
