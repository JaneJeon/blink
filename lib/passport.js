const passport = require('passport')
const SlackStrategy = require('passport-slack-fixed').Strategy
const RememberMeStrategy = require('passport-remember-me-extended').Strategy
const httpError = require('http-errors')
const ms = require('ms')

const User = require('../models/user')
const Team = require('../models/team')
const slack = require('./slack')
const { createToken, consumeToken } = require('./token')

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.query().findById(id, true))
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

const allowedTeams = process.env.SLACK_TEAMS.toLowerCase().split(',')
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
        if (!allowedTeams.includes(profile.team.domain))
          throw httpError(400, 'Cannot sign in with this team')

        const [user, team] = await Promise.all([
          User.findOrCreate(profile.user.id, {
            id: profile.user.id,
            name: profile.user.name,
            avatar: slack.largestIcon(profile.user)
          }),
          Team.findOrCreate(profile.team.id, {
            id: profile.team.id,
            name: profile.team.name,
            avatar: slack.largestIcon(profile.team)
          })
        ])
        await user.$relatedQuery('teams').relate(team)

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
