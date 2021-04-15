if (process.argv.length !== 2 || process.argv.length !== 3) {
  console.error('usage: npm run promote-user [$userIdToPromote]')
  process.exit(1)
}

;(async () => {
  require('../config')

  const User = require('../models/user')

  if (process.argv.length === 2) {
    const users = await User.query()
    if (users.length > 1) {
      console.error('More than one user in the database!')
      process.exit(2)
    } else if (users.length === 0) {
      console.error('No user in the database!')
      process.exit(3)
    }

    const user = users[0]
    await user.$query().patch({ role: 'superuser' })
  } else {
    await User.query()
      .findById(process.argv[2] - 0)
      .patch({ role: 'superuser' })
  }
})().catch(err => {
  console.error(err)
  process.exit(500)
})
