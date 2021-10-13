exports.read = (allow, forbid, user, body) => {
  allow('read', 'User') // eventually we want to limit by "domain" but for now, ehhh
}

exports.create = (allow, forbid, user, body) => {
  allow('create', 'User')
  forbid('create', 'User', { deactivated: true }) // prevent deactivated users from signing in
}

exports.update = (allow, forbid, user, body) => {
  allow('update', 'User', { id: user.id })
  forbid('update', 'User', ['id', 'role', 'deactivated'])

  if (user.role === 'superuser') {
    allow('update', 'User', ['deactivated', 'role'])

    // force superusers to step down as user before being deactivated
    forbid('update', 'User', ['deactivated'], { role: 'superuser' })
  }
}
