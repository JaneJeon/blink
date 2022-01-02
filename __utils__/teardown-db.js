const closeConns = require('../lib/close-connections')

if (typeof afterAll !== 'undefined')
  afterAll(async () => {
    await closeConns()
  })

module.exports = closeConns
