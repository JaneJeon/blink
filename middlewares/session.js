const session = require('cookie-session')
const ms = require('ms')

module.exports = session({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  sameSite: 'lax',
  maxAge: ms(process.env.SESSION_DURATION)
})
