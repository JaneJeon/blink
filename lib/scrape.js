const got = require('got')
const ms = require('ms')
const httpError = require('http-errors')
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
const timeoutMs = ms(process.env.LINK_TIMEOUT)
const timeout = () => new Promise(resolve => setTimeout(resolve, timeoutMs, ''))

module.exports = async url => {
  log.info(`Scraping ${url} for metadata...`)

  const request = got(url)
  const result = await Promise.race([request, timeout()])

  if (typeof result === 'string') {
    request.cancel() // cancel request since it timed out

    // We need to reject valid but nonexistent URLs
    throw httpError(400, `Could not reach ${url}!`)
  } else {
    const { body: html } = result

    return metascraper({ html, url })
  }
}
