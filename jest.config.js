require('./config')
const isCI = require('is-ci')
process.env.JEST_JUNIT_OUTPUT_NAME = 'reports/junit/jest/results.xml'

module.exports = {
  collectCoverage: isCI,
  collectCoverageFrom: [
    'models/*.js',
    'routes/*.js',
    'lib/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  errorOnDeprecated: true,
  reporters: isCI ? ['default', 'jest-junit'] : undefined,
  testEnvironment: 'node'
}
