// I can't use regular globbing library as they're all based on bash's path-based globbing,
// not OAuth's resource-based scope matches (i.e. they use '/' instead of ':')

// This accounts for 1. extracting the scopes from the giant string, 2. globs
exports.verify = (scopeStr, requiredScope) => {
  return scopeStr.split(' ').some(scope => {
    if (scope.includes('*')) {
      // There's a * to expand; given that each section is separated by a colon,
      // try to expand it and see if it fits
      const scopeFragments = scope.split(':')
      const requiredFragments = requiredScope.split(':')

      if (scopeFragments.length !== requiredFragments.length) return false

      for (let i = 0; i < scopeFragments.length; i++) {
        const scopeFragment = scopeFragments[i]
        const requiredFragment = requiredFragments[i]

        if (scopeFragment === '*') {
          // wildcard
          continue
        } else {
          if (scopeFragment !== requiredFragment) return false
        }
      }

      return true
    } else {
      // Nothing to expand here, so only a direct comparison is needed.
      return scope === requiredScope
    }
  })
}
