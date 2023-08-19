const got = require('got')

module.exports = got.default.extend({
  handlers: [
    (options, next) => {
      const promiseOrStream = next(options)

      // A destroy function that supports both promises and streams.
      // For newer versions, we could use abortcontroller, but alas...
      const destroy = message => {
        if (options.isStream) {
          promiseOrStream.destroy(message)
          return
        }

        // Also note that got v11 is a fucking troll and won't actually pass on the cancellation reason.
        promiseOrStream.cancel(message)
      }

      promiseOrStream.on('response', response => {
        const contentType = response.headers['content-type']

        // The goal is to not download *anything* if it's not HTML,
        // not only because we can't get metadata from non-HTML responses,
        // but also because non-HTML responses may cause us to download some gigantic payload.
        if (contentType && contentType.startsWith('text/html')) {
          options.context.requestLogger.info(
            `Received an HTML page. Returning response as-is for ${response.url}`
          )
          return
        }

        options.context.requestLogger.info(
          `Received a non-HTML response. Aborting early for ${response.url}`
        )
        destroy('Not an HTML response')
      })

      return promiseOrStream
    }
  ]
})
