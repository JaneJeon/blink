.DEFAULT_GOAL := up
.PHONY: build logs sh

D=docker
DC=$(D) compose
DC_SVCS=-f docker-compose.dev.yml
DC_APP=-f docker-compose.yml
DC_ALL=$(DC_SVCS) $(DC_APP)

network-up:
	@$(D) network create public || true

network-down:
	@$(D) network rm public || true

build:
	$(DC) $(DC_APP) build

rebuild:
	$(DC) $(DC_APP) build --no-cache

up: network-up
	$(DC) $(DC_ALL) up --renew-anon-volumes --build -d

down:
	$(DC) $(DC_ALL) down --remove-orphans -v
	$(MAKE) network-down

# e.g. make logs SERVICE=app
logs:
	$(DC) $(DC_ALL) logs -f $(SERVICE)

COMMAND ?= npm run start
run:
	$(DC) $(DC_ALL) run --rm app $(COMMAND)

exec:
	$(DC) $(DC_ALL) exec app $(COMMAND)

cert:
	mkcert -install
	mkcert -cert-file config/traefik/localhost.cert.pem \
		-key-file config/traefik/localhost.key.pem \
		localhost traefik.localhost keycloak.localhost

image:
	docker build -t blink .
