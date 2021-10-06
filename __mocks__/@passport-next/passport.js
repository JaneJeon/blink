exports.initialize = () => (req, res, next) => {
  // Filthy little hack to "mock" req.user from headers
  const role = req.header('X-Mock-Role')
  const id = req.header('X-Mock-Id')

  req.user = {
    id,
    role,
    name: role,
    deactivated: false
  }
  next()
}
exports.session = () => (req, res, next) => next()
exports.authenticate = () => (req, res, next) => next()
exports.use = () => {}
exports.serializeUser = () => {}
exports.deserializeUser = () => {}
