#!/bin/bash
set -e

npm run build

if [ -z "$SKIP_KNEX" ]; then
    NODE_ENV=test npm run migrate
    NODE_ENV=test npm run seed
fi
