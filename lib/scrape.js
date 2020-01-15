const got = require('got')
const timeoutMs = require('ms')(process.env.LINK_TIMEOUT)
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
const log = require('./logger')

// Neither got nor axios *actually* times out when given an invalid URL,
// so force it to time out by starting a timer.
const timeout = () => new Promise(resolve => setTimeout(resolve, timeoutMs, ''))

module.exports = async reqUrl => {
  const request = got(reqUrl)
  const result = await Promise.race([request, timeout()])

  if (typeof result === 'string') {
    log.info(`Request timed out while fetching ${reqUrl}`)
    request.cancel() // cancel request since it timed out

    // Note that even if we fail to fetch metadata, users can fill it in manually,
    // so this "error" should be ignored (hence the reason we're using resolve not reject).
    return {}
  } else {
    const { body: html, url } = result

    return metascraper({ html, url })
  }
}
