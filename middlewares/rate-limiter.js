const rateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const ms = require('ms')
const client = require('../lib/redis')

exports.short = rateLimit({
  headers: true,
  windowMs: ms(process.env.RATE_LIMIT_SHORT_WINDOW),
  max: process.env.RATE_LIMIT_SHORT_MAX - 0,
  keyGenerator: req =>
    (req.apiClient || {}).sub || (req.user || {}).id || req.ip,
  store: new RedisStore({ client })
})

exports.long = rateLimit({
  headers: true,
  windowMs: ms(process.env.RATE_LIMIT_LONG_WINDOW),
  max: process.env.RATE_LIMIT_LONG_MAX - 0,
  keyGenerator: req =>
    (req.apiClient || {}).sub || (req.user || {}).id || req.ip,
  store: new RedisStore({ client })
})
