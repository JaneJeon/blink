const { AbilityBuilder, Ability } = require('@casl/ability')

// We have to manually build the policy map here because we're using this for
// both frontend and backend... even being allowed to use require() is a privilege.
// This can be updated with import syntax once #128 is under way.
const policyMap = { Link: require('./link'), User: require('./user') }

// https://github.com/flexdinesh/browser-or-node/blob/master/src/index.js
const isRunningInNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null
const isReactTest =
  process.env.REACT_TEST === 'true' || process.env.REACT_TEST === '1'

module.exports = (user, resource, action, body, opts, relation) => {
  const { rules, can: allow, cannot: forbid } = new AbilityBuilder(Ability)

  if (isRunningInNode && !isReactTest) {
    // For use in objection-authorize
    const policies = policyMap[resource.constructor.name] // TODO: handle relations
    policies[action](allow, forbid, user, body)
  } else {
    // For use in frontend
    Object.values(policyMap).forEach(policy => {
      Object.values(policy).forEach(action => action(allow, forbid, user, body))
    })
  }

  return new Ability(rules)
}
