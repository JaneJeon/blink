FROM node:lts-alpine AS deps
USER node
WORKDIR /app

# node-gyp
RUN apk add --no-cache --virtual .gyp python make g++ tini
COPY package*.json ./
RUN npm ci --no-fund

# for dev/test frontend/backend
COPY . .
EXPOSE 3000 4000


FROM node:lts-alpine AS build
USER node
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm prune --production && npm clean cache --force


FROM node:lts-alpine AS runner
USER node
WORKDIR /app
ENV NODE_ENV production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

ENTRYPOINT ["/tini", "--"]
CMD ["node", "bin/www"]
# no need to manually tune mem/gc for node>=12 since node heap limit will be based on available memory
