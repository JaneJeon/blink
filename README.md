<h1 align="center">Welcome to myURL 👋</h1>

[![CircleCI](https://img.shields.io/circleci/build/github/JaneJeon/myURL)](https://circleci.com/gh/JaneJeon/myURL)
[![Coverage](https://codecov.io/gh/JaneJeon/myurl/branch/master/graph/badge.svg)](https://codecov.io/gh/JaneJeon/myurl)
[![Maintainability](https://api.codeclimate.com/v1/badges/075998f9f2125e6b7961/maintainability)](https://codeclimate.com/github/JaneJeon/myURL/maintainability)
[![Version](https://img.shields.io/npm/v/myurl)](https://www.npmjs.com/package/myurl)
[![Downloads](https://img.shields.io/npm/dt/myurl)](https://www.npmjs.com/package/myurl)
[![Dependencies](https://img.shields.io/david/JaneJeon/myurl)](https://david-dm.org/JaneJeon/myurl)
[![devDependencies](https://img.shields.io/david/dev/JaneJeon/myurl)](https://david-dm.org/JaneJeon/myurl?type=dev)
[![Vulnerabilities](https://snyk.io//test/github/JaneJeon/myURL/badge.svg?targetFile=package.json)](https://snyk.io//test/github/JaneJeon/myURL?targetFile=package.json)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=JaneJeon/myURL)](https://dependabot.com)
[![License](https://img.shields.io/npm/l/myurl)](https://github.com/JaneJeon/myURL/blob/master/LICENSE)
[![Docs](https://img.shields.io/badge/docs-github-blue)](https://janejeon.github.io/myURL)

> A blazing fast, planet-scale, easy-to-use serverless URL shortener!

The secret sauce is deep integration with CDN and aggressively caching everything.

### 🏠 [Homepage](https://github.com/JaneJeon/myURL)

## Install

```sh
npm i -g myurl # or
yarn global install myurl
```

## Prerequisites

Unfortunately some things can't be automated. e.g. migrating to Route53?

## Usage

```sh
npx myurl domain.name
```

## Architecture

I was originally going to build this using Cloudflare workers + Cloudflare K/V,
**BUT** then I found out I can't have access logs without paying for the Enterprise plan, so here's Plan B:

### AWS

CloudFront allows access log to be stored in S3, and with that we can do any sort of analysis on that.
An additional benefit of this approach is that you can use whatever tool you already have that analyzes access logs on S3, so you don't have to be locked in to the analytics of your link shortener!

And the plan here is to have CloudFront trigger lambdas on any URLs, the lambdas would check DynamoDB for any records, and then instruct CloudFront to cache the results!

This aggressive caching of redirects should make requests instantaneous, while the use of Lambda and DynamoDB would make it 1. serverless (you don't have to maintain anything), and 2. planet-scale!

## TODO (for MVP)

The feature set is more tuned for internal use:

- [ ] ~~Implement atomic counter on DDB~~
- [x] hash(id) => url
- [x] set of normalized URLs? (one of these have to be global secondary index. Warning: eventual consistency!)
- [x] allow URLs to be manually set
- [ ] static page (S3) to actually make these requests
- [ ] Some form of access control
- [ ] Infrastructure as Code (some way to deploy and configure all this)
- [ ] Configure cache headers for static, render, and redirects

## Features that'd be nice to have

- [ ] check malware links, and ban people when they do it too much
- [ ] Banned domains & hosts
- [ ] Visitor risk management (something like CloudFlare's security level, bot fight mode, scrape protection, etc)
- [ ] ~~Option to have "the panel" on the root domain~~
- [ ] Finer-grained, more fully-featured user/team control (e.g. rate limiting on users that aren't signed in)
- [ ] ~~Option to make this public?~~
- [ ] Built-in analytics (that can be disabled if the user chooses to use their own analytics platform)

## Run tests

```sh
yarn test
```

## Author

👤 **Jane Jeon**

- Github: [@JaneJeon](https://github.com/JaneJeon)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check [issues page](https://github.com/JaneJeon/myURL/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Jane Jeon](https://github.com/JaneJeon).<br />
This project is [AGPL-3.0](https://github.com/JaneJeon/myURL/blob/master/LICENSE) licensed.
