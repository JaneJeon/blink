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

  get value() {
    return this.valueData + ''
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt)
    if (!('value' in json)) return json

    // cast settings value into its correct type
    if (json.valueType === 'number') json.valueData = json.value - 0
    else if (json.valueType === 'boolean')
      json.valueData = json.value.trim().toLowerCase() === 'true'

    delete json.value
    return json
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
