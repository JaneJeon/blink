#!/usr/bin/env bash
# I probably should have a way of auto-incrementing seed prefixes... but me lazy
NODE_ENV=development knex seed:make "$@"
NODE_ENV=test knex seed:make "$@"
