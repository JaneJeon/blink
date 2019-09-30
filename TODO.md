## MVP features

- [x] Implement atomic counter
- [x] hash(id) => url
- [x] set of normalized URLs? (one of these have to be global secondary index. Warning: eventual consistency!)
- [x] allow URLs to be manually set
- [ ] static page (S3) to actually make these requests
- [ ] Some form of access control
- [ ] Infrastructure as Code (some way to deploy and configure all this)
- [ ] Configure cache headers for static, render, and redirects (etag?)
- [x] service factory to share www and dash?
- [ ] Ban common words that might be used later (e.g. signup, account) and might be misleading (https://github.com/thedevs-network/kutt/blob/develop/server/controllers/validateBodyController.js#L43)
- [x] 404 by default when a resource is not found

## Nice-to-have

- [ ] Remember-me cookie?
- [ ] Put the dependencies separately on www and dash?
- [ ] mount express-status-monitor since we're going with free Heroku
- [ ] rate limiting
- [ ] check malware links, and ban people when they do it too much
- [ ] Banned domains & hosts
- [ ] Visitor risk management (something like CloudFlare's security level, bot fight mode, scrape protection, etc)
- [ ] ~~Option to have "the panel" on the root domain~~
- [ ] Finer-grained, more fully-featured user/team control (e.g. rate limiting on users that aren't signed in)
- [ ] ~~Option to make this public?~~
- [ ] Built-in analytics (that can be disabled if the user chooses to use their own analytics platform)
