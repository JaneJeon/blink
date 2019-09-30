const mongoose = require('../lib/mongoose')

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

module.exports = mongoose.model('User', schema)
