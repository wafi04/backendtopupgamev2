docker-up:
	cd docker && docker compose -f docker-compose-dev.yml up  -d

docker-down:
	cd docker && docker compose down 

docker-build:
	cd docker && docker compose build

build:
	npm run build