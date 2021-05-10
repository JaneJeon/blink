FROM node:lts-alpine AS deps
RUN apk add --no-cache --virtual .gyp python make g++

USER node
WORKDIR /home/node
COPY package*.json ./
RUN npm ci --no-audit

# for dev/test frontend/backend
COPY --chown=node:node . .
EXPOSE 3000 4000


FROM node:lts-alpine AS build
# TODO: any way to cache apk installs from `deps`?
RUN apk add --no-cache --virtual .gyp python make g++

USER node
WORKDIR /home/node

COPY --chown=node:node . .
COPY --chown=node:node --from=deps /home/node/node_modules ./node_modules
RUN npm run build
# TODO: npm prune takes fucking FOREVER, is there any way to speed this up??
RUN npm prune --production


FROM node:lts-alpine AS runner
RUN apk add --no-cache --virtual tini

USER node
WORKDIR /home/node
ENV NODE_ENV production

COPY --from=build /home/node/package.json ./package.json
COPY --from=build /home/node/node_modules ./node_modules
COPY --from=build /home/node/build ./build

ENTRYPOINT ["/tini", "--"]
CMD ["node", "bin/www"]
# no need to manually tune mem/gc for node>=12 since heap limit will be based on available memory
