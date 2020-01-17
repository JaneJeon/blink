// We skip exports.create, because /api/links is gated by ensureLogin,
// so the public can't access it anyways, plus any member of the team
// should be allowed to shorten a link so this check can be safely skipped.
// By skipping user authorization checks for shortened link creation,
// we can use $relatedQuery() in the POST /api/links route even though
// it's not supported by objection-authorize (yet).

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
