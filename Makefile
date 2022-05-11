.DEFAULT_GOAL := up
.PHONY: build logs sh

D=docker
DC=$(D) compose
DC_APP=-f compose.yaml
DC_SVCS=-f compose.dev.yaml
DC_ALL=$(DC_APP) $(DC_SVCS)

network-up:
	@$(D) network create public || true

network-down:
	@$(D) network rm public || true

build: network-up
	@$(DC) $(DC_APP) build

rebuild:
	@$(DC) $(DC_APP) build --no-cache

up: network-up
	@$(DC) $(DC_ALL) up --renew-anon-volumes --build -d

down:
	@$(DC) $(DC_ALL) down --remove-orphans -v
	@$(MAKE) network-down

# e.g. make logs SERVICE=app
logs:
	$(DC) $(DC_ALL) logs -f $(SERVICE)

COMMAND=sh
dev: up
	NODE_ENV=development $(DC) $(DC_ALL) run --rm app $(COMMAND)

test: up
	NODE_ENV=test $(DC) $(DC_ALL) run --rm app $(COMMAND)

cert:
	mkcert -install
	mkcert -cert-file config/traefik/localhost.cert.pem \
		-key-file config/traefik/localhost.key.pem \
		localhost traefik.localhost keycloak.localhost

image:
	@$(D) build -t blink .

tag:
	git tag -f $(VERSION)
	git push --tags
