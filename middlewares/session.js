const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const ms = require('ms')

module.exports = session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  rolling: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    maxAge: ms('1 day')
  },
  store: new MongoStore({
    mongooseConnection: require('../lib/mongoose').connection,
    touchAfter: ms('1 day') / 1000
  })
})
