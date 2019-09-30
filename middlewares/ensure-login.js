const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login')

module.exports = ensureLoggedIn('/app/login')
module.exports.ensureLoggedOut = ensureLoggedOut
