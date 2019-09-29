const mongoose = require('../lib/mongoose')

const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  i: { type: Number, default: 0 }
})

schema.static('next', async function() {
  const doc = await this.findOneAndUpdate(
    { _id: 'ctr' },
    { $inc: { i: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true, lean: true }
  )
  return doc.i
})

module.exports = mongoose.model('Sequence', schema, 'sequence')
