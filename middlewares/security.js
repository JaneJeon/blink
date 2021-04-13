const helmet = require('helmet')

module.exports = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': ["'self'", 'source.unsplash.com']
    }
  }
})
