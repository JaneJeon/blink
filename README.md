# myURL

A blazing fast, serverless URL shortener that is easy to use and deploy!

## Architecture

I was originally going to build this using Cloudflare workers + Cloudflare K/V, **BUT** then I found out I can't have access logs without paying for the Enterprise plan, so here's Plan B:

### AWS

CloudFront allows access log to be stored in S3, and with that we can do any sort of analysis on that. An additional benefit of this approach is that you can use whatever tool you already have that analyzes access logs on S3, so you don't have to be locked in to the analytics of your link shortener!

And the plan here is to have CloudFront trigger lambdas on any URLs, the lambdas would check DynamoDB for any records, and then instruct CloudFront to cache the results!

This aggressive caching of redirects should make requests instantaneous, while the use of Lambda and DynamoDB would make it 1. serverless (you don't have to maintain anything), and 2. planet-scale!

## TODO (for MVP)

- [ ] Implement atomic counter on DDB
- [ ] hash(id) => url
- [ ] set of normalized URLs?
- [ ] static page (S3) to actually make these requests
- [ ] Some form of access control
- [ ] Infrastructure as Code (some way to deploy and configure all this)

## Features that'd be nice to have

- [ ] Option to have "the panel" on the root domain
- [ ] Finer-grained, more fully-featured user/team control
- [ ] Built-in analytics (that can be disabled if the user chooses to use their own analytics platform)
