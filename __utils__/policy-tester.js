const policies = require('../policies')

module.exports = (user, action, resource, body) => {
  const policy = policies(user, resource, action, body)

  return body
    ? Object.keys(body)
        .map(field => policy.can(action, resource, field))
        .reduce((x, y) => x && y, true)
    : policy.can(action, resource)
}
