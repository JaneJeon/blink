// @ts-ignore
// This is mainly for one-off scripts like migrate/seed.
// Otherwise, you should always strive to specify the NODE_ENV *explicitly*!
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

require('dotenv-flow').config()

const dotenv = require('dotenv')
dotenv.config({ path: '.db.env' })
dotenv.config({ path: '.redis.env' })

module.exports = {}
