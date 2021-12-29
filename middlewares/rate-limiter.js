const rateLimit = require('express-rate-limit').default
const RedisStore = require('rate-limit-redis')
const ms = require('ms')
const client = require('../lib/redis')
const { JWT_AUTH_PROPERTY } = require('../config/constants')

exports.short = rateLimit({
  headers: true,
  windowMs: ms(process.env.RATE_LIMIT_SHORT_WINDOW),
  max: process.env.RATE_LIMIT_SHORT_MAX - 0,
  keyGenerator: req =>
    (req[JWT_AUTH_PROPERTY] || {}).sub || (req.user || {}).id || req.ip,
  store: new RedisStore({ client, prefix: 'rate-limit-short' })
})

exports.long = rateLimit({
  headers: true,
  windowMs: ms(process.env.RATE_LIMIT_LONG_WINDOW),
  max: process.env.RATE_LIMIT_LONG_MAX - 0,
  keyGenerator: req =>
    (req[JWT_AUTH_PROPERTY] || {}).sub || (req.user || {}).id || req.ip,
  store: new RedisStore({ client, prefix: 'rate-limit-long' })
})
