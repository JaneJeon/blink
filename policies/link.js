exports.read = (allow, forbid, user, body) => {
  // Everyone can read any link (duh)
  allow('read', 'Link')
}

exports.create = (allow, forbid, user, body) => {
  // Everyone who's logged in can create link
  if (user.role !== 'anonymous') allow('create', 'Link')
}

exports.update = (allow, forbid, user, body) => {
  // You can update metadata for a link, since it's only consumed internally.
  allow('update', 'Link', ['meta'], { creatorId: user.id })

  // The only other "change" you can make is to add a hash
  allow('update', 'Link', ['hash'], {
    creatorId: user.id,
    hash: { $in: [undefined, null] }
    // hash is undefined when the user input is empty, but null when the database column is empty
  })
}

exports.delete = (allow, forbid, user, body) => {
  // Only an owner can delete a link, since it involves CDN cache busting.
  if (user.role === 'owner') allow('delete', 'Link')
}
