import set from 'lodash/set'
import validators from '../schema/validators'

export default function createValidator(schemaName) {
  const validate = validators[schemaName]

  // https://gist.github.com/dalcib/d65257e07f9ef2c166ea86cd14c7c147
  return function validateForm(values) {
    const valid = validate(values)
    const errors = {}

    if (!valid)
      validate.errors.forEach(ajvError => {
        if (ajvError.keyword === 'required')
          set(errors, ajvError.params.missingProperty, ajvError.message)
        else errors[ajvError.dataPath.substr(1)] = ajvError.message // .foo.bar => foo.bar
      })

    return errors
  }
}
