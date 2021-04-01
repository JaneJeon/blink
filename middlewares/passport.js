const { Issuer, Strategy } = require('openid-client')
const passport = require('passport')
const { UniqueViolationError } = require('objection')
const User = require('../models/user')

let client
// TODO: need ESM conversion for top-level await
Issuer.discover(process.env.OIDC_ISSUER_BASE_URL).then(issuer => {
  client = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID,
    redirect_uris: [`${process.env.BASE_URL}/auth/login/callback`],
    response_types: ['id_token']
  })
})

passport.use(
  'oidc',
  new Strategy({ client, passReqToCallback: true }, async (tokenSet, done) => {
    const { sub: id, name } = tokenSet.claims()

    let user

    try {
      user = await User.query()
        .insertAndFetch({ id, name })
        .authorize()
        .fetchResourceContextFromDB()
    } catch (e) {
      if (e instanceof UniqueViolationError)
        user = await User.query().findById(id)
      else return done(e)
    }

    // TODO: set session map on redis userSession:$userId -> [req.session.id]
    // to allow deleting sessions by user

    done(null, user)
  })
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    // TODO: cache this call
    const user = await User.query().findById(id)
    done(null, user)
  } catch (e) {
    done(e)
  }
})

module.exports = passport
