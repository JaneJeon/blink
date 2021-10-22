// Run/require this for basically any non-production usage to make your life easier

// cleaner stacks for debugging
require('trace')
require('clarify')

// This is so that pino v7 doesn't break under jest (why is this shit even necessary)
require('on-exit-leak-free')

module.exports = () => {}
