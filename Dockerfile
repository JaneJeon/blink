#----------------------------------------#
# dev/test
FROM node:lts-alpine AS deps
RUN apk add --no-cache --virtual .gyp python make g++ libc6-compat

# Install pnpm for faster installs
RUN npm i -g pnpm --no-audit && \
    pnpm config set store-dir .pnpm-store

USER node
WORKDIR /home/node

# "Cache" node_modules first so that changes in the source code doesn't trigger a rebuild
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node package.json ./
RUN pnpm i --frozen-lockfile --prefer-offline

COPY --chown=node:node . .

# We want to be able to override this for testing
ENV NODE_ENV development

# without this, oidc-client will attempt to connect to keycloak literally right on startup and crash the whole app
ENTRYPOINT [ "./scripts/wait-for", "http://keycloak:8080/auth/realms/blink-realm", "--" ]


#----------------------------------------#
# We have a separate build container to persist build artifacts & production npm deps
FROM node:lts-alpine AS build
RUN apk add --no-cache --virtual .gyp python make g++ libc6-compat

# Install pnpm for faster installs
RUN npm i -g pnpm --no-audit && \
    pnpm config set store-dir .pnpm-store

USER node
WORKDIR /home/node

# idk if this *actually* caches node_modules from the deps image or not so that the first COPY is only run when package.json changes
COPY --chown=node:node --from=deps /home/node/node_modules ./node_modules
COPY --chown=node:node . ./

RUN pnpm run build && \
    pnpm i --prefer-offline -P && \
    rm -rf .cache .pnpm-store


#----------------------------------------#
FROM node:lts-alpine AS runner
RUN apk add --no-cache tini

USER node
WORKDIR /home/node

COPY --from=build /home/node ./

ENV NODE_ENV production

# While we already handle SIGINT/SIGTERM directly, there is no way for us to be 100% SURE that none of our dependencies won't spawn a zombie process.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "bin/www"]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
