const nock = require('nock')

nock.disableNetConnect()

nock(/timeout\.com/)
  .get('/')
  .delay(100000)
  .reply(200, '<html></html>')
  .persist()

nock(/^((?!timeout\.com).)*$/)
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
