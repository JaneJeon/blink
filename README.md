<h1 align="center">Welcome to Blink 👋</h1>

[![CircleCI](https://circleci.com/gh/JaneJeon/blink.svg?style=shield)](https://circleci.com/gh/JaneJeon/blink)
[![Prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Deploy to Heroku](https://img.shields.io/badge/deploy%20to-heroku-6762a6)](https://heroku.com/deploy)

> Modern, lightweight, planet-scale link shortener for teams 🎉
>
> Easy to setup, connect with your org's SSO, and hook up analytics!

_See the [documentation](https://docs.blink.rest) for more information about the project itself (including screenshots)_

## Development

### Prerequisites

You need the following components to develop and run Blink locally:

- [mkcert](https://github.com/FiloSottile/mkcert)
- docker & docker-compose (note that on Linux, docker & docker-compose are two separate deps)

If you want to run the project locally (without Docker), note that we use [pnpm](https://pnpm.io) - simply run `npm i -g pnpm` to install!

### Before you start

1. Run `make cert` to generate the SSL certs required for HTTPS local development

2. Run `make up` to stand up the containers

3. On your docker-compose logs, you should be able to see when the `keycloak` container finishes initializing. Once it is ready, go to https://keycloak.localhost and login with `admin`/`password`.

4. Go to the "Blink Realm" (see top left corner) and create a dummy user to login as, following the instructions here: https://www.keycloak.org/docs/latest/server_admin/#_create-new-user

And once you're done with development, you can run `make down` to shut down and cleanup all the containers that spun up.

NOTE: that you actually _do not_ have to run the cleanup every time you `npm start`; you can shut down the `npm start` server/frontend combo and re-boot it as many times as you'd like without needing to `make up` every time - the migrations and the build process will run fine even with existing data(!)

### Troubleshooting

If you can't reach any service or if you suspect the routing is messed up, first check https://traefik.localhost to make sure that everything is configured correctly.

If you need to run a one-off command with the app container, run `make run COMMAND=$whatever`, and if you want to _hook into_ the existing app container, run `make exec COMMAND=sh`.

Note that for performance/security reasons, the app container is built end-to-end with `alpine`-based images, so you won't have access to anything fancy like, say, `bash`.

### Starting Blink

Run `make run` to boot up backend express server and frontend react "live-loader". You can access the app at https://localhost/app! Both the frontend and the backend will live-reload as you make changes.

Behind the scenes, the frontend (a create-react-app app) is running at http://localhost:4000/app and is being reverse proxied from https://localhost/app, and everything else in https://localhost gets proxied to the backend at http://localhost:3000. Yes, there are two processes running in the container pretending to be one "site", but this kind of routing (thanks Traefik!) allows us to not have horrible routing issues (stemming from the fact that even though they're both http://localhost, the different port means they're effectively _two different sites_ and leads to a whole host of routing, CORS, and other integration issues), _and_ allows testing of features that are only available for HTTPS in order to simulate real-world usage as much as possible.

## Run tests

```sh
make run COMMAND='npm test'

# or, for interactive testing:
make run COMMAND=sh
$ npm run test:watch
```

## Author

👤 **Jane Jeon**

- Github: [@JaneJeon](https://github.com/JaneJeon)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check [issues page](https://github.com/JaneJeon/blink/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Jane Jeon](https://github.com/JaneJeon).<br />
This project is [AGPL-3.0](https://github.com/JaneJeon/blink/blob/master/LICENSE) licensed (TL;DR: please contribute back improvements to this application).

---

This project is based off of [Express-Objection-Template](https://github.com/JaneJeon/express-objection-template), and heavily uses [objection-authorize](https://github.com/JaneJeon/objection-authorize) and [objection-hashid](https://github.com/JaneJeon/objection-hashid) to drive much of "hidden" logic and make isomorphism possible.
