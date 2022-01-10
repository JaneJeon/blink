<h1 align="center">Welcome to Blink 👋</h1>

[![CircleCI](https://circleci.com/gh/JaneJeon/blink.svg?style=shield)](https://circleci.com/gh/JaneJeon/blink)
[![Prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Deploy to Heroku](https://img.shields.io/badge/deploy%20to-heroku-6762a6)](https://heroku.com/deploy)

> Modern, lightweight, planet-scale link shortener for teams 🎉
>
> Easy to setup, connect with your org's SSO, hook up analytics, and extend!

_See the [documentation](https://docs.blink.rest) for more information about the project itself (including screenshots)_

## Development

### Prerequisites

You need the following components to develop and run Blink locally:

- [mkcert](https://github.com/FiloSottile/mkcert)
- docker & docker-compose (note that on Linux, docker & docker-compose are two separate deps)
- an x86-based machine (unfortunately, Keycloak - even in its latest version - does not work with ARM-based devices)

### Before you start

1. Run `make cert` to generate the SSL certs required for HTTPS local development

2. Run `make up` to stand up the containers

And once you're done with development, you can run `make down` to shut down and cleanup all the containers that spun up.

NOTE: that you actually _do not_ have to run the cleanup every time you `npm start`; you can shut down the `npm start` server/frontend combo and re-boot it as many times as you'd like without needing to `make up` every time - the migrations and the build process will run fine even with existing data(!)

### Starting Blink

Run `make dev` to stand up the development environment (i.e. it will run the actual container in which Blink will be run in "dev mode", which is fancy term for `NODE_ENV=development`). Then, run `npm start` to run Blink, which consists of a backend express server and a frontend react "live-loader". You can access the app at https://localhost/app! Both the frontend and the backend will live-reload as you make changes. You can login as the user specified at the end of `config/keycloak.json` (username: `user`, password: `Password1`).

Behind the scenes, the frontend (a create-react-app app) is running at http://localhost:4000/app and is being reverse proxied from https://localhost/app, and everything else in https://localhost gets proxied to the backend at http://localhost:3000. Yes, there are two processes running in the container pretending to be one "site", but this kind of routing (thanks Traefik!) allows us to not have horrible routing issues (stemming from the fact that even though they're both http://localhost, the different port means they're effectively _two different sites_ and leads to a whole host of routing, CORS, and other integration issues), _and_ allows testing of features that are only available for HTTPS in order to simulate real-world usage as much as possible.

### Troubleshooting

If you can't reach any service or if you suspect the routing is messed up, first check https://traefik.localhost to make sure that everything is configured correctly.

Note that for performance/security reasons, the app container is built end-to-end with `alpine`-based images, so you won't have access to anything fancy like, say, `bash`.

## Run tests

```sh
make test COMMAND='npm test'

# or, for interactive testing:
make test
$ npm run test:watch
```

## Releasing

Blink has a git tag-based semver release strategy. Once any number of PRs make it into master, we can pull it and tag it as follows:

```sh
git tag -f vX
git tag -f vX.Y
git tag -f vX.Y.Z
```

And then push it as follows:

```sh
git push -f --tags
```

That will trigger CI to push Docker images for vX, vX.Y, and vX.Y.Z!

## Author

👤 **Jane Jeon**

- Github: [@JaneJeon](https://github.com/JaneJeon)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check [issues page](https://github.com/JaneJeon/blink/issues?q=is%3Aopen+is%3Aissue+-label%3Ablocked).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Jane Jeon](https://github.com/JaneJeon).<br />
This project is [AGPL-3.0](https://github.com/JaneJeon/blink/blob/master/LICENSE) licensed.

TL;DR: you are free to use this application "as-is" in your code or on its own, without needing to make your code source-available and license it under the same license as this application; however, if you do change this application and you distribute this it (which includes using it to provide a public service over the network), please do contribute back any improvements for this application and this application only.

---

This project is based off of [Express-Objection-Template](https://github.com/JaneJeon/express-objection-template), and heavily uses [objection-authorize](https://github.com/JaneJeon/objection-authorize) and [objection-hashid](https://github.com/JaneJeon/objection-hashid) to drive much of "hidden" logic and make isomorphism possible.
