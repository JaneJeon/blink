const { Router } = require('express')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

module.exports = Router().get('*', (req, res) => handle(req, res))
module.exports.prepare = app.prepare()
