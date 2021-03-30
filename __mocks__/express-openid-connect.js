const auth = () => (req, res, next) => next()
auth.Store = function () {}
exports.auth = auth

exports.requiresAuth = () => (req, res, next) => {
  const role = req.header('X-Mock-Role')
  req.user = {
    id: role,
    role,
    name: role,
    deactivated: false
  }

  next()
}
