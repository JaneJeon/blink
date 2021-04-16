<h1 align="center">Welcome to Blink (WIP) 👋</h1>

[![CircleCI](https://circleci.com/gh/JaneJeon/blink.svg?style=shield)](https://circleci.com/gh/JaneJeon/blink)
[![Prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Deploy to Heroku](https://img.shields.io/badge/deploy%20to-heroku-6762a6)](https://heroku.com/deploy)

> Modern, lightweight, planet-scale link shortener for teams 🎉
>
> Easy to setup, connect with your org's SSO, and hook up analytics!

_See the [documentation](https://blink.rest) for more information about the project itself_

## Development

### Before you start

1. Run `make up` (need docker/docker-compose installed)

2. On your docker-compose logs, you should be able to see when the `keycloak` container finishes initializing (it says something like "admin panel listening at http://localhost:8080"). Once it is ready, go to said admin panel, login with `admin`/`password`.

3. Go to the "Blink Realm" (see top left corner) and create a dummy user to login as, following the instructions here: https://www.keycloak.org/docs/latest/server_admin/#_create-new-user

And once you're done with development, you can run `make down` to shut down and cleanup all the containers that spun up.

NOTE: that you actually _do not_ have to run the cleanup every time you `npm start`; you can shut down the `npm start` server/frontend combo and re-boot it as many times as you'd like without needing to `make up` every time - the migrations and the build process will run fine even with existing data(!)

### Starting Blink

Run `npm start` to boot up backend express server and frontend react "live-loader"

Congrats, now the frontend should be available at http://localhost:4000/app and the backend at http://localhost:3000!

One thing of note: when you log in with Keycloak's SSO, you will be redirected to http://localhost:3000/app on development mode; just change that to http://localhost:4000/app and hit enter. I am NOT changing this.

## Run tests

```sh
npm test
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
