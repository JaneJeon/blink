import Ajv from 'ajv'
import { set } from 'lodash'
import memo from 'lodash/memoize'
import schema from '../schema.json'

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true
})

const getValidatorForModel = memo(name => ajv.compile(schema[name]))

export default function createValidator(schemaName) {
  const validate = getValidatorForModel(schemaName)

  // https://gist.github.com/dalcib/d65257e07f9ef2c166ea86cd14c7c147
  return function validateForm(values) {
    const valid = validate(values)
    const errors = {}

    if (!valid)
      return validate.errors.forEach(ajvError => {
        if (ajvError.keyword === 'required')
          set(errors, ajvError.params.missingProperty, ajvError.message)
        else errors[ajvError.dataPath.substr(1)] = ajvError.message // .foo.bar => foo.bar
      })

    return errors
  }
}
