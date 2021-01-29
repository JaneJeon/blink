// Run/require this for basically any non-production usage to make your life easier

module.exports = () => {
  // cleaner stacks for debugging
  require('trace')
  require('clarify')
}
