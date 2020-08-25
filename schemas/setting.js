const yup = require('yup')

module.exports = yup.object().shape({
  id: yup.string().required(),
  category: yup.string().required(),
  valueData: yup
    .mixed()
    .required()
    .when('valueType', (type, schema) => {
      if (type === 'string') return schema.string()
      if (type === 'number') return schema.number()
      if (type === 'boolean') return schema.boolean()
    })
    .when('id', (id, schema) => {
      switch (id) {
        case 'defaultRole':
        case 'whoCanSeeAllLinks':
        case 'whoCanCreateLink':
          return schema.oneOf(['guest', 'user', 'admin'])
        case 'whoCanDeleteOwnLink':
        case 'whoCanDeleteAnyLink':
          return schema.oneOf(['user', 'admin', 'never'])
        default:
          return schema
      }
    }),
  valueType: yup.string().required()
})
