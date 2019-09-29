require('dotenv-defaults').config()
const restana = require('restana')

module.exports = () => {
  const service = restana({
    errorHandler: require('../middlewares/error-handler')
  })
  let server

  service.useMiddlewares = (middlewares = []) => {
    middlewares.forEach(middleware => service.use(middleware))
    return service
  }

  Object.defineProperty(service, 'server', {
    get: () => {
      if (server) return server
      if (process.env.NODE_ENV !== 'test')
        service
          .start(process.env.PORT)
          .then(server => {
            const address = server.address()
            console.log(
              `Server listening at ${address.address}:${address.port}`
            )
          })
          .catch(err => {
            console.error(err)
            process.exit(1)
          })

      process.on('SIGINT', () => {
        service.close().then(() => process.exit())
      })

      // for jest testing
      server = service.getServer()
      return server
    }
  })

  return service
}
