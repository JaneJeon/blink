module.exports =
  process.env.NODE_ENV !== 'development'
    ? (req, res, next) => next()
    : require('morgan')('dev')
