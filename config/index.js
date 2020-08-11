const dotenv = require('dotenv')
dotenv.config()
dotenv.config({ path: '.default.env' })
dotenv.config({ path: '.db.env' })
dotenv.config({ path: '.redis.env' })

module.exports = {}
