const jwt = require('jsonwebtoken')

module.exports = (payload = {}) => {
  const token = jwt.sign(payload, process.env.OAUTH2_JWT_SECRET, {
    audience: process.env.OAUTH2_JWT_AUDIENCE,
    issuer: process.env.OAUTH2_JWT_ISSUER,
    subject: 'test-oauth2-client',
    algorithm: process.env.OAUTH2_JWT_ALGORITHMS.split(',')[0]
  })

  return { Authorization: `Bearer ${token}` }
}
