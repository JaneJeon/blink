require('./config')

process.env.LOG_LEVEL = 'error'
process.env.LINK_TIMEOUT = '2 seconds'
process.env.JEST_JUNIT_OUTPUT_NAME = 'results.xml'
process.env.JEST_JUNIT_OUTPUT_DIR = 'reports/jest'

module.exports = {
  collectCoverageFrom: [
    'models/*.js',
    'routes/**/*.js',
    'lib/*.js',
    'policies/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/__utils__/**',
    '!**/__mocks__/**'
  ],
  errorOnDeprecated: true,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/scripts/init-models.js',
  testPathIgnorePatterns: ['node_modules/', 'src/'],
  reporters: ['default', 'jest-junit']
}
