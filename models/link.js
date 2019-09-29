const mongoose = require('../lib/mongoose')
const Sequence = require('./sequence')

const { URL } = require('url')
const normalizeUrl = require('normalize-url')
const HashIds = require('hashids/cjs')
const hash = new HashIds(process.env.DOMAIN, process.env.HASH_MIN_LENGTH - 0)

const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: url => new URL(url).host !== process.env.DOMAIN,
      msg: `Cannot shorten ${process.env.DOMAIN} URLs`
    },
    set: url => normalizeUrl(url, { forceHttps: true })
  },
  hash: {
    type: String,
    unique: true,
    trim: true,
    minlength: process.env.HASH_MIN_LENGTH,
    maxlength: process.env.HASH_MAX_LENGTH,
    validate: [
      {
        validator: hash => /^\w+$/.test(hash),
        msg: 'Hashes must be alphanumeric'
      },
      {
        validator: val => !hash.decode(val).length,
        msg: 'Cannot use this hash'
      }
    ]
  }
})

schema.pre('save', async function() {
  if (!this.hash) this.hash = hash.encode(await Sequence.next())
})
schema.virtual('redirectTo').get(function() {
  return `${process.env.DOMAIN}/${this.hash}`
})

module.exports = mongoose.model('Link', schema)
