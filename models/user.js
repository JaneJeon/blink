const mongoose = require('../lib/mongoose')
const cachegoose = require('cachegoose')

const schema = new mongoose.Schema({
  email: { type: String, unique: true },
  emailVerified: Boolean,

  github: {
    // can't do this
    // hide: true,
    id: String,
    token: String
  },

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
})

const cacheKey = id => `cache:user:${id}`
schema.static('cacheKey', cacheKey)
schema.post('save', function(doc) {
  cachegoose.clearCache(cacheKey(doc.id))
})

module.exports = mongoose.model('User', schema)
