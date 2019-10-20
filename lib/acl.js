const AccessControl = require('role-acl')

const acl = require('../config/acl')
const ac = new AccessControl(acl)

const promises = []
for (const role in acl)
  if (acl[role].extends)
    promises.push(
      ac.extendRole(role, acl[role].extends.role, acl[role].extends.condition)
    )

module.exports = ac
module.exports.initialize = () => Promise.all(promises)
