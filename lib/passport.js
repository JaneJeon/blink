const passport = require('passport')
const SlackStrategy = require('passport-slack-fixed').Strategy
const RememberMeStrategy = require('passport-remember-me-extended').Strategy
const httpError = require('http-errors')
const ms = require('ms')

const User = require('../models/user')
const slack = require('./slack')
const { createToken, consumeToken } = require('./token')

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.query()
      .findById(id, true)
      .whereNotDeleted()

    done(null, user)
  } catch (err) {
    done(err)
  }
})

const msRemember = ms(process.env.SESSION_REMEMBER_ME)
passport.use(
  new RememberMeStrategy(
    async (token, done) => {
      try {
        const id = await consumeToken(token)

        done(null, await User.query().findById(id, true))
      } catch (err) {
        done(err)
      }
    },
    async (user, done) => {
      try {
        done(null, await createToken(msRemember, user.id))
      } catch (err) {
        done(err)
      }
    }
  )
)

if (!process.env.SLACK_TEAM_ID && !process.env.SLACK_TEAM_DOMAIN)
  throw new Error('Need to define either SLACK_TEAM_ID or SLACK_TEAM_DOMAIN!')
passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/slack/callback`,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (req.user) done(null, req.user)
        if (
          (process.env.SLACK_TEAM_ID &&
            process.env.SLACK_TEAM_ID !== profile.team.id) ||
          (process.env.SLACK_TEAM_DOMAIN &&
            process.env.SLACK_TEAM_DOMAIN !== profile.team.domain)
        )
          throw httpError(400, 'Cannot sign in with this team')

        let [user, firstUserExists] = await Promise.all([
          User.query().findById(profile.user.id),
          User.query()
            .whereNotDeleted()
            .first()
        ])
        // deleted users don't exist...
        if (user.deleted) return done(null, false)

        if (!user)
          user = await User.query().insertAndFetch({
            id: profile.user.id,
            name: profile.user.name,
            avatar: slack.largestIcon(profile.user),
            role: firstUserExists ? 'user' : 'owner'
          })

        // https://github.com/dereklakin/passport-remember-me#setting-the-remember-me-cookie
        if (req.body.rememberMe || req.body.remember_me) {
          const token = await createToken(msRemember, user.id)
          // default cookie options
          req.res.cookie('remember_me', token, {
            maxAge: msRemember,
            sameSite: 'lax'
          })
        }

        done(null, user)
      } catch (err) {
        done(err)
      }
    }
  )
)

module.exports = passport
