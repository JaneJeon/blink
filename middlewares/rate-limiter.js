const rateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const ms = require('ms')
const client = require('../lib/redis')

module.exports = rateLimit({
  headers: true,
  windowMs: ms(process.env.RATE_LIMIT_WINDOW),
  max: req =>
    (req.user
      ? process.env.RATE_LIMIT_MAX_LOGGED_IN
      : process.env.RATE_LIMIT_MAX_LOGGED_OUT) - 0,
  keyGenerator: req => req.user || req.ip,
  store: new RedisStore({ client, passIfNotConnected: true })
})
