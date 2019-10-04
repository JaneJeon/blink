const mongoose = require('mongoose')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const log = require('./logger')
const createError = require('http-errors')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', err => {
  log.error(err)
  process.exit(1)
})

require('cachegoose')(mongoose)
require('mongoose-schema-jsonschema')(mongoose)

mongoosePaginate.paginate.options = { sort: '-updatedAt', limit: 20 }
mongoose.plugin(require('mongoose-hidden')())
mongoose.plugin(mongoosePaginate)
mongoose.plugin(accessibleRecordsPlugin)
mongoose.plugin(accessibleFieldsPlugin)
mongoose.plugin(schema => {
  schema.post('findOne', (doc, next) => {
    next(doc ? undefined : createError(404))
  })
})

module.exports = mongoose
