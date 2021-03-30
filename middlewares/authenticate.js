const { auth, requiresAuth } = require('express-openid-connect')
const { JWT } = require('jose')
const { UniqueViolationError } = require('objection')
const RedisStore = require('connect-redis')(auth)
const User = require('../models/user')
const client = require('../lib/redis')

exports.requiresAuth = requiresAuth
exports.useAuth = auth({
  enableTelemetry: false,
  authRequired: false,
  afterCallback: async (req, res, session) => {
    const { sub: id, name } = JWT.decode(session.id_token)

    let user

    try {
      user = await User.query()
        .insertAndFetch({ id, name })
        .authorize()
        .fetchResourceContextFromDB()
    } catch (e) {
      if (e instanceof UniqueViolationError)
        user = await User.query().findById(id)
      else throw e
    }

    return { ...session, user }
  },
  session: {
    store: new RedisStore({ client })
  }
})
