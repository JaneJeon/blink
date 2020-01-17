const { ensureLoggedIn } = require('connect-ensure-login')
const httpError = require('http-errors')

module.exports = (req, res, next) => {
  // For GET requests, redirect server-side if not logged in
  if (req.method === 'GET') ensureLoggedIn('/app/login')(req, res, next)
  // For non-GET requests, there's really no point in redirects.
  else {
    if (!req.isAuthenticated()) throw httpError(401)
    else next()
  }
}
