function docker_compose() {
	docker-compose -f docker-compose.dev.yml $@
}

function ctrl_c() {
	docker_compose down
	# docker_compose down --rmi all --volumes --remove-orphans
}

trap ctrl_c INT

docker_compose down
docker_compose up --build -d
echo ">> INITIALIZATION..."
docker_compose exec backend initialize_licensing_elsman_db development.ini
echo ">> INITIALIZED!"
docker_compose logs --follow
