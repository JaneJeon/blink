const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const client = require('../lib/redis')
const ms = require('ms')

module.exports = session({
  store: new RedisStore({ client, prefix: 'sess:' }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: ms(process.env.SESSION_DURATION),
    sameSite: 'lax'
  }
})
