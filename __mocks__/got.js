module.exports = url => {
  const timeout = url === 'https://timeout.com' ? 100000 : 10

  const result = new Promise(resolve =>
    setTimeout(() => {
      resolve({
        body: `
          <!doctype html>
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
          </html>`,
        url
      })
    }, timeout)
  )
  result.cancel = () => {}

  return result
}
