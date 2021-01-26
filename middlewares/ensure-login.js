const httpError = require('http-errors')

module.exports = (req, res, next) => {
  // There's no point to redirecting AJAX calls from the frontend. Just throw a 401.
  if (!req.user) throw httpError(401)
  else next()
}
