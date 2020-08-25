const User = require('../../models/user')

exports.seed = async () => {
  await User.query().insert([
    { id: 'guest', role: 'guest' },
    { id: 'user', role: 'user' },
    { id: 'admin', role: 'admin' }
  ])
}
