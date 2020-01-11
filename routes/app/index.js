const { Router } = require('express')
const ensureLogin = require('../../middlewares/ensure-login')
const next = require('next')
const app = next({ dev: process.env.NODE_ENV !== 'production' }) // TODO: what does this option do?
const handle = app.getRequestHandler()

module.exports = Router().get('*', ensureLogin, (req, res) => handle(req, res))
module.exports.prepare = app.prepare()
