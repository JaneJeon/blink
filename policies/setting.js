exports.update = (allow, forbid, user, body) => {
  if (user.role === 'admin') allow('update', 'Setting')
}
