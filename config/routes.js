const fs = require('fs')
const path = require('path')

module.exports = {
  redirect: {
    signup: '/app/login',
    signin: '/app/login',
    login: '/app/login',
    logout: '/auth/logout',
    account: '/app/account',
    settings: '/app/settings'
  },
  // the folders in the public directory
  public: fs
    .readdirSync('public')
    .filter(f => fs.statSync(path.join('public', f)).isDirectory())
  // TODO: add pages
}
