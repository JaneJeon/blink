exports.read = (allow, forbid, user, body) => {
  allow('read', 'User') // eventually we want to limit by "domain" but for now, ehhh
}

exports.create = (allow, forbid, user, body) => {
  allow('create', 'User')
  forbid('create', 'User', { deactivated: true }) // prevent deactivated users from signing in
}

exports.update = (allow, forbid, user, body) => {
  forbid('update', 'User', ['id', 'role'])
  allow('update', 'User', { id: user.id })

  if (user.role === 'superuser') allow('update', 'User')
}

exports.deactivate = (allow, forbid, user, body) => {
  allow('deactivate', 'User', { id: user.id })

  if (user.role === 'superuser') allow('deactivate', 'User')
}

exports.reactivate = (allow, forbid, user, body) => {
  if (user.role === 'superuser') allow('reactivate', 'User')
}
