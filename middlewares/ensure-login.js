const { ensureLoggedIn } = require('connect-ensure-login')
const httpError = require('http-errors')

module.exports = (req, res, next) => {
  if (req.method === 'GET') ensureLoggedIn('/app/login')(req, res, next)
  else throw httpError(401)
}
