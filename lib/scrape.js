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
const httpError = require('http-errors')
const log = require('./logger')

// const nock = require('nock')
// nock.disableNetConnect()
// nock.enableNetConnect('keycloak:8080')
// nock('https://timeout.com')
//   .get('/')
//   .delay(100000)
//   .reply(200, '<html></html>')
//   .persist()

const timeoutMs = ms(process.env.LINK_TIMEOUT)

module.exports = async url => {
  log.info(`Scraping %s for metadata...`, url)

  try {
    const promise = got(url, {
      timeout: { request: timeoutMs }
    })
    // TODO: just rely on got's built-in timeout once got v12 comes out
    setTimeout(() => {
      // At the moment, got's timeout doesn't work for shit
      promise.cancel()
    }, timeoutMs)

    const { body: html, url: finalUrl } = await promise
    return metascraper({ html, url: finalUrl })
  } catch (err) {
    if (err.name === 'RequestError' && err.code === 'ENOTFOUND')
      throw httpError(404, 'The address to shorten does not exist!')
    if (err.name === 'CancelError')
      throw httpError(504, 'Could not scrape link in time!')
    else throw err
  }
}
