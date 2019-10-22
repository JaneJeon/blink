const nanoid = require('nanoid')
const redis = require('./redis')

exports.createToken = async (ms, value, length) => {
  const token = nanoid(length)
  await redis.psetex(token, ms, value)
  return token
}

exports.consumeToken = async token => {
  const result = await redis
    .pipeline()
    .get(token)
    .del(token)
    .exec()

  return result[0][1]
}
