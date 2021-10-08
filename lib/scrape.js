const got = require('got')
const ms = require('ms')
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
const pTimeout = require('p-timeout')
const log = require('./logger')

const timeoutMs = ms(process.env.LINK_TIMEOUT)

module.exports = async url => {
  log.info(`Scraping %s for metadata...`, url)

  const { body: html, url: finalUrl } = await pTimeout(got(url), timeoutMs)
  return metascraper({ html, url: finalUrl })
}
