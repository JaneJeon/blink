const helmet = require('helmet')

module.exports = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", '*.unsplash.com'],
      'script-src': ["'self'", "'unsafe-eval'"]
    }
  }
})
