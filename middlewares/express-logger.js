const logger = require('../lib/logger')

module.exports = (req, res, next) => {
  req.log = logger.child({ req })
  next()
}
