.PHONY: up, up-all, down
up:
	docker-compose -f docker-compose.yml up -d

up-all:
	docker-compose up -d

down:
	docker-compose down
