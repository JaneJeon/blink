const httpError = require('http-errors')

module.exports = (req, res, next) => {
  // TODO: remove this hack after implementing proper SSO integration on the frontend!!!
  if (process.env.NODE_ENV === 'development')
    req.user = { id: 1, role: 'superuser', name: 'Jane Doe' }

  // There's no point to redirecting AJAX calls from the frontend. Just throw a 401.
  if (!req.user) throw httpError(401)
  else next()
}
