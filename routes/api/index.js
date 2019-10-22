const { Router } = require('express')

module.exports = Router().use('/v1', require('./v1'))
