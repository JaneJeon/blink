const express = require('express')

module.exports = express.Router().get('*', express.static('build/'))
