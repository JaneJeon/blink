#----------------------------------------#
# dev/test
FROM node:lts-alpine AS deps
RUN apk add --no-cache --virtual .gyp python make g++ libc6-compat

USER node
WORKDIR /home/node

# "Cache" node_modules first so that changes in the source code doesn't trigger a rebuild
COPY package*.json ./
RUN npm ci --no-audit

COPY --chown=node:node . .

# We want to be able to override this for testing
ENV NODE_ENV development

# without this, oidc-client will attempt to connect to keycloak literally right on startup and crash the whole app
ENTRYPOINT [ "./scripts/wait-for", "-t", "120", "keycloak:8080/auth/realms/blink-realm", "--" ]


#----------------------------------------#
# We have a separate build container to persist build artifacts & production npm deps
FROM node:lts-alpine AS build
RUN apk add --no-cache --virtual .gyp python make g++ libc6-compat

USER node
WORKDIR /home/node

# idk if this *actually* caches node_modules from the deps image or not so that the first COPY is only run when package.json changes
COPY --chown=node:node --from=deps /home/node/node_modules ./node_modules
COPY --chown=node:node . ./

# for whatever reason, npm ci'ing from scratch is *much* faster than npm prune --production
# Also, since we copied over ~/.npm, we can abuse the cache for even FASTER installs!!!
RUN npm run build && \
    npm ci --prefer-offline --no-audit --production && \
    rm -rf .cache .npm
# RUN npm run build && \
#     npm prune --production && \
#     rm -rf .cache .npm


#----------------------------------------#
FROM node:lts-alpine AS runner

USER node
WORKDIR /home/node

COPY --from=build /home/node ./

ENV NODE_ENV production

# No need for tini or any init scripts since we 1. don't spawn zombies, 2. already handle SIGTERM/SIGINT
CMD ["node", "bin/www"]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
