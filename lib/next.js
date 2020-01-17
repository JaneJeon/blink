// https://nextjs.org/docs/advanced-features/custom-server
const path = require('path')
const next = require('next')

const app = next({
  dev: process.env.NODE_ENV !== 'production',
  // quiet: true,
  dir: path.dirname(__dirname)
})

module.exports = app
