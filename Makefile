.DEFAULT_GOAL := up
.PHONY: network-up, network-down, up, up-all, down, logs

network-up:
	docker network create public || true

network-down:
	docker network rm public || true

up: network-up
	docker-compose -f docker-compose.yml up -d

up-all: network-up
	docker-compose up -d

down: network-down
	docker-compose down --remove-orphans

logs:
	docker-compose logs -f

cert:
	mkcert -install
	mkcert -cert-file config/traefik/localhost.cert.pem \
		-key-file config/traefik/localhost.key.pem \
		localhost *.localhost
