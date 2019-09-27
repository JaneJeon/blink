const mongoose = require('mongoose')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('error', err => {
  console.error(err)
  process.exit(1)
})

mongoose.plugin(require('mongoose-unique-validator'))
mongoose.plugin(require('mongoose-hidden')())
mongoose.plugin(accessibleRecordsPlugin)
mongoose.plugin(accessibleFieldsPlugin)

module.exports = mongoose
