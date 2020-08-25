const yup = require('yup')

module.exports = yup.object().shape({
  id: yup.string().required(),
  role: yup.string().required().oneOf(['guest', 'user', 'admin']),
  name: yup.string()
})
