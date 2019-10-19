const logger = require('../lib/logger')

module.exports = (req, res, next) => {
  req.log = logger.child({ req })
  req.res = res
  next()
}
