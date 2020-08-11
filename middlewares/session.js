const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const client = require('../lib/redis').default
const ms = require('ms')

module.exports = session({
  store: new RedisStore({ client }),
  secret: process.env.SESSION_SECRET,
  sameSite: 'lax',
  maxAge: ms(process.env.SESSION_DURATION)
})
