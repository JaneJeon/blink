const Keygrip = require('keygrip')
const kg = Keygrip([process.env.SESSION_SECRET])
const sessKey = 'appSession'

// We rely on sessions for req.user, and it's not exactly easy to mock out the session.
// This module allows you to fake cookies and set any custom req.user you want.
module.exports = mockUserId => {
  // In config/passport.js, we defined the serializedUser as the user id.
  // So we must set req.session.passport.user as the id to let passport
  // "deserialize" it and fill in the req.user we want.
  // For more details, see here: https://git.io/JvU13
  const sessData = { passport: { user: mockUserId } }
  const sessStr = Buffer.from(JSON.stringify(sessData)).toString('base64')
  const sessCookie = `${sessKey}=${sessStr}`

  const hash = kg.sign(sessCookie)
  const hashCookie = `${sessKey}.sig=${hash}`

  // The `session` key is the default for cookie-session.
  return `${sessCookie};${hashCookie};`
}
