.DEFAULT_GOAL := up
.PHONY: build logs

D=docker
DC=docker-compose

network-up:
	@$(D) network create public || true

network-down:
	@$(D) network rm public || true

build:
	$(DC) build

rebuild:
	$(DC) build --no-cache

up: network-up
	$(DC) up --renew-anon-volumes --abort-on-container-exit --build

down: network-down
	$(DC) down --remove-orphans -v

# e.g. make logs SERVICE=app
logs:
	$(DC) logs -f $(SERVICE)

sh:
	$(DC) exec app bash

cert:
	mkcert -install
	mkcert -cert-file config/traefik/localhost.cert.pem \
		-key-file config/traefik/localhost.key.pem \
		localhost traefik.localhost keycloak.localhost
