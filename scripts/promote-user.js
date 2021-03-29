if (process.argv.length !== 3) {
  console.log('usage: npm run promote-user $userIdToPromote')
  process.exit(1)
}

;(async () => {
  require('../config')

  const User = require('../models/user')

  await User.query()
    .findById(process.argv[2] - 0)
    .patch({ role: 'superuser' })
})()
