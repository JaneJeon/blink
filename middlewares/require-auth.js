const httpError = require('http-errors')

module.exports = (req, res, next) => {
  if (req.user) next()
  else next(httpError(401))
}
