require('dotenv-flow').config({ silent: true })

if (process.env.NEW_RELIC_LICENSE_KEY) require('newrelic')

module.exports = {}
