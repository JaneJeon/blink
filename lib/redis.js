// istanbul ignore file
const Redis = require('ioredis')

module.exports = new Redis(process.env.REDIS_URL, {
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
})
