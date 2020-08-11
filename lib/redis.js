// istanbul ignore file
const Redis = require('ioredis')
const log = require('./logger')
const showFriendlyErrorStack = process.env.NODE_ENV !== 'production'

const pub = new Redis(process.env.REDIS_URL, { showFriendlyErrorStack })
const sub = new Redis(process.env.REDIS_URL, { showFriendlyErrorStack })

pub.on('error', err => log.error(err))
sub.on('error', err => log.error(err))

module.exports = {
  default: pub,
  pub,
  sub,
  awaitSubscribe: sub.psubscribe('lynx:*')
}
