// This file also happens to serve as an entrypoint of sorts

require('dotenv-flow').config({ silent: true })

if (process.env.NODE_ENV !== 'production')
  require('../__utils__/dev-test-setup')

module.exports = {}
