const { Router } = require('express')
const app = require('../../lib/next')
const handle = app.getRequestHandler()

module.exports = Router().get('*', (req, res) => handle(req, res))
