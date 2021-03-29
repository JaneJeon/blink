const { Router } = require('express')

module.exports = Router().get('/', (req, res) => res.send(req.user))
