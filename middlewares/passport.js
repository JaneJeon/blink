const { Issuer, Strategy } = require('openid-client')
const passport = require('@passport-next/passport')
const { UniqueViolationError } = require('objection')
const User = require('../models/user')
const log = require('../lib/logger')

let client
// TODO: need ESM conversion for top-level await
Issuer.discover(process.env.OIDC_ISSUER_BASE_URL)
  .then(issuer => {
    log.info('Connected to OIDC issuer')

    client = new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: 'YOU DONT NEED CLIENT SECRET',
      redirect_uris: [`${process.env.BASE_URL}/auth/login/callback`],
      response_types: ['code']
    })

    passport.use(
      'oidc',
      new Strategy({ client }, async (tokenSet, done) => {
        const { sub: id, preferred_username: name } = tokenSet.claims()
        const loginLogger = log.child({ userId: id })
        loginLogger.info('Trying to log in user')

        let user
        try {
          user = await User.query()
            .insertAndFetch({ id, name })
            .authorize()
            .fetchResourceContextFromDB()
          loginLogger.info('Provisioned user')
        } catch (e) {
          if (e instanceof UniqueViolationError) {
            loginLogger.info('Found user')
            user = await User.query().findById(id)
          } else {
            loginLogger.info('User is forbidden from logging in')
            return done(e)
          }
        }

        // TODO: set session map on redis userSession:$userId -> [req.session.id]
        // to allow deleting sessions by user

        loginLogger.info('Done logging in user')
        done(null, user)
      })
    )
  })
  .catch(err => log.error(err))

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
