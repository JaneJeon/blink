.PHONY: test-setup, setup
test-setup:
	docker-compose -f docker-compose.yml up

setup:
	docker-compose up
