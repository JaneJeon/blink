const passport = require('passport')
const SlackStrategy = require('passport-slack-fixed').Strategy
const { NotFoundError } = require('objection')
const httpError = require('http-errors')
const ms = require('ms')

const User = require('../models/user')
const slack = require('../lib/slack')

// Note that in all these strategies, we're filtering out deleted users,
// since we don't want deleted users to be able to login.

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (req, id, done) => {
  try {
    const user = await User.query().findById(id).filterDeleted()

    // sticky sessions
    req.sessionOptions.maxAge = ms(process.env.SESSION_DURATION)
    done(null, user)
  } catch (err) {
    err instanceof NotFoundError ? done(null, false) : done(err)
  }
})

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
        // If someone's logged in, just pass them through.
        if (req.user) done(null, req.user)

        // Check that either the team ID or the domain matches.
        if (
          (process.env.SLACK_TEAM_ID &&
            process.env.SLACK_TEAM_ID !== profile.team.id) ||
          (process.env.SLACK_TEAM_DOMAIN &&
            process.env.SLACK_TEAM_DOMAIN !== profile.team.domain)
        )
          throw httpError(400, 'Cannot sign in with this team')

        // See if the user is already registered.
        let user = await User.query().findById(profile.user.id).filterDeleted()

        // The user isn't registered, so register them.
        if (!user) {
          // Note: when there's no one else in the team, i.e. you're the first user,
          // you're automatically promoted to owner status.
          const otherUsersExist = await User.query().filterDeleted().first()

          user = await User.query().insertAndFetch({
            id: profile.user.id,
            name: profile.user.name,
            avatar: slack.largestIcon(profile.user),
            role: otherUsersExist ? 'user' : 'owner'
          })
        }

        done(null, user)
      } catch (err) {
        err instanceof NotFoundError ? done(null, false) : done(err)
      }
    }
  )
)

module.exports = passport
