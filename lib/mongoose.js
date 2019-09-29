const mongoose = require('mongoose')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', err => {
  console.error(err)
  process.exit(1)
})

mongoose.plugin(require('mongoose-unique-validator'))
mongoose.plugin(require('mongoose-hidden')())
mongoose.plugin(accessibleRecordsPlugin)
mongoose.plugin(accessibleFieldsPlugin)

module.exports = mongoose
