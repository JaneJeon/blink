// "Creating" a user does not make sense in the context of user authorization,
// because you "create" a user by simply signing in with your team's slack account.

exports.read = (allow, forbid, user, body, relation) => {
  // everyone in a team can read each other
  allow('read', 'User')
}

exports.update = (allow, forbid, user, body, relation) => {
  // A user can update only itself, but not some fields
  allow('update', 'User', { id: user.id })
  forbid('update', 'User', ['id', 'role', 'deleted'])

  if (user.role === 'owner') {
    // The owner can promote/demote any user
    allow('update', 'User', 'role')
  } else if (user.role === 'admin' && body.role !== 'owner') {
    // An admin can promote a user to admin, or recuse itself
    allow('update', 'User', 'role', { role: 'user' })
    allow('update', 'User', 'role', { id: user.id })
  }

  // disable updates to a deleted user
  forbid('update', 'User', { deleted: true })
}

// While we're not *actually* deleting a user, objection-soft-delete allows us
// to separate out soft deletions from updates (which is what they are).
exports.delete = (allow, forbid, user, body, relation) => {
  // Always require explicit confirmation whenever deleting any user by anyone
  if (!body.confirm) return

  // A user can delete only itself
  allow('delete', 'User', { id: user.id })

  if (user.role === 'admin') {
    // An admin can 'delete' a regular user
    allow('delete', 'User', { role: 'user' })
  } else if (user.role === 'owner') {
    // Owners can delete anyone
    allow('delete', 'User')
  }
}
