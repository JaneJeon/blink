const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/user')
const ms = require('ms')

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  User.findById(id)
    .cache(ms('1h') / 1000, User.cacheKey(id))
    .exec((err, user) => done(err, user))
})

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ github: profile.id }, (err, existingUser) => {
        if (err) return done(err)
        if (existingUser) return done(null, existingUser)

        User.create(
          {
            github: profile.id,
            profile: {
              name: profile.displayName,
              picture: profile._json.avatar_url,
              location: profile._json.location,
              website: profile._json.blog
            }
          },
          (err, user) => done(err, user)
        )
      })
    }
  )
)

module.exports = passport
