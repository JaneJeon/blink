const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('error', err => {
  console.error(err)
  process.exit(1)
})

module.exports = mongoose
