const { URL } = require('url')
const normalizeUrl = require('normalize-url')
const HashIds = require('hashids/cjs')
const hash = new HashIds(process.env.DOMAIN, process.env.HASH_MIN_LENGTH - 0)

const mongoose = require('../lib/mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      immutable: true,
      get: id => hash.encode(id)
    },
    url: {
      type: String,
      required: true,
      trim: true,
      minlength: process.env.HASH_MIN_LENGTH,
      maxlength: process.env.HASH_MAX_LENGTH,
      validate: [
        {
          validator: url => new URL(url).host !== process.env.DOMAIN,
          msg: `Cannot shorten ${process.env.DOMAIN} URLs`
        }
      ],
      set: url => normalizeUrl(url, { forceHttps: true }),
      unique: true
    }
  },
  { _id: false }
)

schema.plugin(AutoIncrement)
schema.statics.findByHashId = function(hashId) {
  return this.findById(hash.decode(hashId)[0])
}

module.exports = mongoose.model('Link', schema)
