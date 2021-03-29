module.exports = () => (req, res, next) => {
  const role = req.header('X-Mock-Role')
  if (role) {
    req.oidc = {
      sub: role,
      preferred_username: 'Test User',
      resource_access: {
        'lynx-app': {
          roles: [role]
        }
      }
    }
  }

  next()
}
