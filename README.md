<h1 align="center">Welcome to lynx 👋</h1>

[![GitHub Actions](https://github.com/JaneJeon/lynx/actions)](https://github.com/JaneJeon/lynx/workflows/Build/badge.svg)
[![Coverage](https://codecov.io/gh/JaneJeon/lynx/branch/master/graph/badge.svg)](https://codecov.io/gh/JaneJeon/lynx)
[![Dependencies](https://img.shields.io/david/JaneJeon/lynx)](https://david-dm.org/JaneJeon/lynx)
[![devDependencies](https://img.shields.io/david/dev/JaneJeon/lynx)](https://david-dm.org/JaneJeon/lynx?type=dev)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/JaneJeon/lynx)](https://snyk.io//test/github/JaneJeon/lynx?targetFile=package.json)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=JaneJeon/Lynx)](https://dependabot.com)
[![License](https://img.shields.io/npm/l/myurl)](https://github.com/JaneJeon/myURL/blob/master/LICENSE)
[![Docs](https://img.shields.io/badge/docs-github-blue)](https://janejeon.github.io/lynx)
[![Standard code style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Deploy to Heroku](https://img.shields.io/badge/deploy%20to-heroku-6762a6)](https://heroku.com/deploy)
[![Issues](https://img.shields.io/badge/issues-trello-blue)](https://trello.com/b/QCCf001W)
[![Issues](https://img.shields.io/badge/issues-github-blue)](https://github.com/JaneJeon/lynx/issues)

> Modern, lightweight, and planet-scale link shortener + analytics + management!

The secret sauce is deep integration with CDN and aggressively caching everything.

### 🏠 [Homepage](https://github.com/JaneJeon/lynx)

## Install

Server + admin panel: heroku (how to update? do we release docker images?)
CDN/DNS: ???
Analytics: ???

## Usage

// todo

## Architecture

I was originally going to build this using Cloudflare workers + Cloudflare K/V,
**BUT** then I found out I can't have access logs without paying for the Enterprise plan, so here's Plan B:

### AWS

CloudFront allows access log to be stored in S3, and with that we can do any sort of analysis on that.
An additional benefit of this approach is that you can use whatever tool you already have that analyzes access logs on S3, so you don't have to be locked in to the analytics of your link shortener!

And the plan here is to have CloudFront trigger lambdas on any URLs, the lambdas would check DynamoDB for any records, and then instruct CloudFront to cache the results!

This aggressive caching of redirects should make requests instantaneous, while the use of Lambda and DynamoDB would make it 1. serverless (you don't have to maintain anything), and 2. planet-scale!

## Run tests

```sh
yarn test
```

## Author

👤 **Jane Jeon**

- Github: [@JaneJeon](https://github.com/JaneJeon)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check [issues page](https://github.com/JaneJeon/lynx/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Jane Jeon](https://github.com/JaneJeon).<br />
This project is [AGPL-3.0](https://github.com/JaneJeon/lynx/blob/master/LICENSE) licensed.

---

This project is based off of [Express-Objection-Template](https://github.com/JaneJeon/express-objection-template)
