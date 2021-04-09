// Returns json path from json schema
import schema from '../schema.json'

export default function getJsonPath(model) {
  return function (path) {
    let ptr = schema[model]

    path.split('.').forEach(str => {
      ptr = ptr.properties[str]
    })

    return ptr
  }
}
