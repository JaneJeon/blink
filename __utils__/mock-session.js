// We rely on sessions for req.user, and it's not exactly easy to mock out the session.
// However, we *can* fake the sessions and have it decode to req.user!
module.exports = userId => {
  // In config/passport.js, we defined the serializedUser as the user id.
  // So we must set req.session.passport.user as the id to let passport
  // "deserialize" it and fill in the req.user we want.
  // For more details, see here: https://git.io/JvU13
  const session = { passport: { user: userId } }
  const cookie = Buffer.from(JSON.stringify(session)).toString('base64')

  // The `session` key is the default for cookie-session.
  return `session=${cookie}`
}
