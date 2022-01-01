const nock = require('nock')

// nock.disableNetConnect()

// Mock HTTP timeouts
;['timeout.com', 'www.timeout.com'].forEach(url => {
  nock(url).get('/').delay(100000).reply(200, '<html></html>').persist()
})

// For a couple of "stock" websites, prevent actually hitting them
;['nodejs.org', 'google.com', 'example.com', 'js.org'].forEach(url => {
  nock(url)
    .get('/')
    .reply(
      200,
      `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Some Title</title>
        <meta name="description" content="Some Description">
        <meta name="author" content="Some Author">
      </head>
      <body>
        <p>Hello!</p>
      </body>
    </html>`
    )
    .persist()
})
