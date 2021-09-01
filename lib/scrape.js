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

const timeoutMs = ms(process.env.LINK_TIMEOUT)
let httpClient

module.exports = async url => {
  if (!httpClient) {
    const { got } = await import('got')
    const { gotScraping } = await import('got-scraping')
    const { gotSsrf } = await import('got-ssrf')
    httpClient = got.extend(gotScraping, gotSsrf)
  }

  log.info(`Scraping %s for metadata...`, url)

  const request = httpClient(url)
  // Neither got nor axios *actually* times out when given an invalid URL,
  // so force it to time out by starting a timer.
  let timer
  const timeout = new Promise(resolve => {
    timer = setTimeout(resolve, timeoutMs, '')
  })

  const result = await Promise.race([request, timeout])

  if (typeof result === 'string') {
    request.cancel() // cancel request since it timed out

    // We need to reject valid but nonexistent URLs
    throw httpError(400, `Could not reach ${url}!`)
  } else {
    // cancel timeout promise since the request succeeded
    clearTimeout(timer)

    const { body: html } = result

    return metascraper({ html, url })
  }
}
