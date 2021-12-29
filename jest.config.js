require('./config')

process.env.LOG_LEVEL = 'error'
process.env.LINK_TIMEOUT = '2 seconds'

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
  notify: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules/', 'src/'],
  globalTeardown: './__utils__/teardown-db.js',
  setupFilesAfterEnv: [
    './__utils__/dev-test-setup.js',
    './__utils__/teardown-db.js'
  ]
}
