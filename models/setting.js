const BaseModel = require('./base')
const visibility = require('objection-visibility').default

// TODO: put a (configurable) 15 min timer on caches, just in case message passing fails
// const { pub, sub } = require('../lib/redis')
// const cache = {}

// sub.on('message', (channel, message) => {
//   if (channel !== Setting.channel) return

//   const { key, value } = JSON.parse(message)
//   cache[key] = value
// })

class Setting extends visibility(BaseModel) {
  static get hidden() {
    return ['valueData', 'valueType']
  }

  static get virtualAttributes() {
    return ['value']
  }

  // Automatically transform the setting value to its "native" type -
  // the frontend can get the other settings information (e.g. valueType, choices)
  // from the JSONschema.
  get value() {
    if (this.valueType === 'number') return this.valueData - 0
    if (this.valueType === 'boolean') return this.valueData === 'true'
    return this.valueData
  }

  static async beforeUpdate(args) {
    await super.beforeUpdate(args)
    const { inputItems, asFindQuery, cancelQuery } = args // relation not supported

    // hijack the query and run individual update
    await asFindQuery().patch({
      // transform the value into string -
      // note that we don't have to "normalize" the value in any way
      // since it's already been checked by the schema!
      valueData: inputItems[0].value + ''
    })

    cancelQuery()
  }

  // TODO: look up cache, then proceed with the query
  // static async beforeFind(args) {
  //   await super.beforeFind(args)
  //   // TODO: how to filter only findById?
  //   const { inputItems, transaction } = args
  // }

  // TODO: populate cache
  // static async afterFind(args) {
  //   await super.afterFind(args)
  // }

  // TODO: publish changes
  // static async afterUpdate(args) {
  //   await super.afterUpdate(args)
  //   pub.publish(this.channel, JSON.stringify({ key, value }))
  // }
}

module.exports = Setting
