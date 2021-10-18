const policies = require('../policies')
const keys = require('lodash/keys')

module.exports = (user, action, resource, body) => {
  const policy = policies(user, resource, action, body)

  return body
    ? keys(body)
        .map(field => policy.can(action, resource, field))
        .reduce((x, y) => x && y, true)
    : policy.can(action, resource)
}
