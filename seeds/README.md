## Running seeds per environment

Run `npm run seed:make $your_seed_name` to create development & test seeds. As the name implies, seeds under `development/` are only loaded when `NODE_ENV=development`, and seeds under `test/` are only loaded during tests (jest automatically injects `NODE_ENV=test`).

### FAQ

- Why is there a `development/` folder and a `test/` folder but not a `production/` folder?

Good question. The existence of a `production/` folder would imply that you would actually use seeding for production.

Think about that for a minute.

Why the _fuck_ would you ever want to use seeds for production? DON'T!
