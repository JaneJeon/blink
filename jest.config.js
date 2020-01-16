require('./config')
const isCI = require('is-ci')

process.env.JEST_JUNIT_OUTPUT_NAME = 'reports/junit/jest/results.xml'
process.env.LOG_LEVEL = 'error'
process.env.LINK_TIMEOUT = '2 seconds'

module.exports = {
  collectCoverage: isCI,
  collectCoverageFrom: [
    'models/*.js',
    'routes/*.js',
    'lib/*.js',
    'policies/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/__utils__/**',
    '!**/__mocks__/**'
  ],
  errorOnDeprecated: true,
  reporters: isCI ? ['default', 'jest-junit'] : undefined,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/scripts/init-models.js'
}
