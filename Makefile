.PHONY: up, up-all, down, logs
up:
	docker-compose -f docker-compose.yml up -d

up-all:
	docker-compose up -d

down:
	docker-compose down --remove-orphans

logs:
	docker-compose logs -f
