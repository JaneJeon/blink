const { AbilityBuilder, Ability } = require('@casl/ability')

// We have to manually build the policy map here because we're using this for
// both frontend and backend... even being allowed to use require() is a privilege.
// This can be updated with import syntax once #128 is under way.
const policyMap = { Link: require('./link') }

module.exports = (user, resource, action, body, opts, relation) => {
  const { rules, can: allow, cannot: forbid } = new AbilityBuilder(Ability)
  const policies = policyMap[body.constructor.name]

  // when action is specified, we can narrow the ability down to the action level
  if (action) policies[action](allow, forbid, user, body)
  // "Merge" all the rules by calling allow/forbid on all of them.
  else
    Object.values(policies).forEach(policy => policy(allow, forbid, user, body))

  return new Ability(rules)
}
