const fs = require('fs')
const naturalSort = require('string-natural-compare')
const pkg = require('../../package')

module.exports = {
  title: pkg.name,
  description: pkg.description,
  themeConfig: {
    repo: pkg.repository,
    docsDir: 'docs',
    editLinks: true,
    lastUpdated: 'Last Updated',

    nav: [
      {
        text: 'Guide',
        link: '/guide/'
      },
      {
        text: 'Swagger',
        link: 'https://www.npmjs.com/search?q=swagger' // TODO:
      }
    ],

    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: fs
            .readdirSync('docs/guide')
            .filter(doc => doc.toLowerCase() !== 'readme.md')
            .sort(naturalSort)
        }
      ]
    }
  }
}
