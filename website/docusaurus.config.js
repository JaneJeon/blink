/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Blink',
  tagline: 'Link Shortener',
  url: 'https://docs.blink.rest',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'JaneJeon', // Usually your GitHub org/user name.
  projectName: 'blink', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Blink',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          to: '/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left'
        },
        {
          href: 'https://github.com/JaneJeon/blink',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Getting Started',
        //       to: 'docs/'
        //     }
        //   ]
        // },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/docusaurus'
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus'
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/docusaurus'
        //     }
        //   ]
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/JaneJeon/blink'
        //     }
        //   ]
        // }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jane Jeon`
    },
    algolia: {
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: 'blink'
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/JaneJeon/blink/edit/master/website/',
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  plugins: ['@docusaurus/plugin-ideal-image']
}
