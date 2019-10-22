const axios = require('axios').default
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-lang')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-publisher')(),
  require('metascraper-title')()
])

// I know the metascraper docs say to use got, but it doesn't honour the timeout,
// so in case an invalid URL was passed, it would literally just sit there forever.
module.exports = async url => {
  const { data } = await axios(url, { timeout: 3000 })

  return metascraper({ html: data, url })
}
