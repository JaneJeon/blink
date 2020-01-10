exports.create = (allow, forbid, user, body) => {
  // Anyone can create a link.
  // Note: the specific conditions are handled by the model,
  // since we do URL normalization AFTER the query has been built
  allow('create', 'Link')
}

exports.read = (allow, forbid, user, body) => {
  // Everyone can read each other's links.
  allow('read', 'Link')
}

exports.update = (allow, forbid, user, body) => {
  // You can update metadata for a link, since it's only consumed internally.
  allow('update', 'Link', ['meta'], { creatorId: user.id })

  // The only other "change" you can make is to add a hash
  allow('update', 'Link', ['hash'], { creatorId: user.id, hash: undefined })
}

exports.delete = (allow, forbid, user, body) => {
  // Only an owner can delete a link, since it involves CDN cache busting.
  if (user.role === 'owner') allow('delete', 'Link')
}
