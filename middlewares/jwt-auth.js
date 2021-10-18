// Use express-jwt here instead of passport-jwt because we can't really ameliorate the differences
// between session-based user auth and JWT-based API auth.
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const ms = require('ms')
const httpError = require('http-errors')
const { JWT_AUTH_PROPERTY, API_USER_ID } = require('../config/constants')
const User = require('../models/user')
const scope = require('../lib/scope')

exports.useJwtAuth =
  process.env.OAUTH2_ENABLED === 'true'
    ? jwt({
        secret:
          process.env.OAUTH2_JWT_SECRET ||
          jwks.expressJwtSecret({
            jwksUri: process.env.OAUTH2_JWKS_URI,
            timeout: ms(process.env.OAUTH2_JWKS_HTTP_TIMEOUT),
            rateLimit: true,
            jwksRequestsPerMinute:
              process.env.OAUTH2_JWKS_REQUESTS_PER_MINUTE - 0
          }),
        audience: process.env.OAUTH_JWT_AUDIENCE,
        issuer: process.env.OAUTH_JWT_ISSUER,
        algorithms: process.env.OAUTH2_JWT_ALGORITHMS.split(','),
        credentialsRequired: false,
        requestProperty: JWT_AUTH_PROPERTY
      }).unless(req => !req.isApi)
    : (req, res, next) => next()

exports.normalizeJwtUser = (req, res, next) => {
  if (req[JWT_AUTH_PROPERTY]) {
    req.user = User.fromJson(
      {
        id: API_USER_ID,
        role: 'superuser',
        name: 'API Client',
        deactivated: false,
        scope: req[JWT_AUTH_PROPERTY].scope || process.env.OAUTH2_DEFAULT_SCOPE,
        kid: req[JWT_AUTH_PROPERTY].kid,
        iss: req[JWT_AUTH_PROPERTY].iss,
        sub: req[JWT_AUTH_PROPERTY].sub
      },
      { skipValidation: true }
    )
  }
  next()
}

exports.requireScope = requiredScopeStr => {
  const requiredScopes = requiredScopeStr.split(' ')

  return (req, res, next) => {
    if (req[JWT_AUTH_PROPERTY]) {
      requiredScopes.forEach(requiredScope => {
        if (!scope.verify(req.user.scope, requiredScope)) {
          next(httpError(403))
        }
      })
    }

    next()
  }
}
