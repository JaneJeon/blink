const { Router } = require('express')

module.exports = Router().use('/links', require('./links'))
