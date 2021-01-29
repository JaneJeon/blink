.PHONY: up, up-test, up-shit, down
up-test:
	docker-compose -f docker-compose.yml up

up:
	docker-compose up

down:
	docker-compose down
