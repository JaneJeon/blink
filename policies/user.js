const { verify } = require('../lib/scope')
const { API_USER_ID } = require('../config/constants')

exports.read = (allow, forbid, user, body) => {
  if (user.id === API_USER_ID && verify(user.scope, 'user:read'))
    allow('read', 'User')

  allow('read', 'User') // eventually we want to limit by "domain" but for now, ehhh
}

exports.create = (allow, forbid, user, body) => {
  if (user.id === API_USER_ID && verify(user.scope, 'user:create'))
    allow('create', 'User')

  allow('create', 'User')
  forbid('create', 'User', { deactivated: true }) // prevent deactivated users from signing in
}

exports.update = (allow, forbid, user, body) => {
  if (user.id === API_USER_ID && verify(user.scope, 'user:update'))
    allow('update', 'User')

  allow('update', 'User', { id: user.id })
  forbid('update', 'User', ['id', 'role', 'deactivated'])

  if (user.role === 'superuser') {
    allow('update', 'User', ['deactivated', 'role'])

    // force superusers to step down as user before being deactivated
    forbid('update', 'User', ['deactivated'], { role: 'superuser' })
  }
}
