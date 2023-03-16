const helmet = require('helmet')

module.exports = helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      // This CSP policy controls which images can be loaded on the web page.
      // The 'self' is self-evident, the unsplash.com is for the background image of the login page,
      // and the data: is for displaying QR code images, which are loaded as `data:` URLs:
      // https://stackoverflow.com/a/18449556
      'img-src': ["'self'", 'data:', '*.unsplash.com']
    }
  }
})
