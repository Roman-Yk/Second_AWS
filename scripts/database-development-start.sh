function ctrl_c() {
	docker-compose -f docker-compose.dev.yml down
}

trap ctrl_c INT

docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d database
docker-compose -f docker-compose.dev.yml run backend initialize_licensing_elsman_db development.ini
docker-compose -f docker-compose.dev.yml logs -f database
