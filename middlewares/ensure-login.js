const { ensureLoggedIn } = require('connect-ensure-login')

module.exports = ensureLoggedIn('/app/login')
