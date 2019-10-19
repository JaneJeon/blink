const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const ms = require('ms')

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  rolling: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    maxAge: ms(process.env.SESSION_DURATION)
  },
  store: new RedisStore({ client: require('../lib/redis') })
})
