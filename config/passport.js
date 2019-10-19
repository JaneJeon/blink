const passport = require('passport')
const SlackStrategy = require('passport-slack-fixed').Strategy
const httpError = require('http-errors')

const User = require('../models/user')
const Team = require('../models/team')
const slack = require('../lib/slack')

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.query().findById(id, true))
  } catch (err) {
    done(err)
  }
})

const allowedTeams = process.env.SLACK_TEAMS.toLowerCase().split(',')
passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/slack/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
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
        done(null, user)
      } catch (err) {
        done(err)
      }
    }
  )
)

module.exports = passport
