const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const get = require('lodash/get')

const parseToken = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 1,
    jwksUri: process.env.OIDC_JWKS_URI
  }),

  // TODO: Validate the audience and the issuer.
  algorithms: process.env.OIDC_ALGORITHMS.split(','),

  requestProperty: 'oidc'
})

const parseUser = (req, res, next) => {
  const token = get(req, 'oidc')
  if (token)
    req.user = {
      id: get(token, 'sub'),
      role: get(token, process.env.OIDC_USER_ROLE)
    }
  next()
}

module.exports = [parseToken, parseUser]
