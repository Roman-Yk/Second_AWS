export COMPOSE_PROJECT_NAME=licensing_tests

function docker_compose() {
	docker-compose -f docker-compose.tests.yml $@
}

docker_compose down
docker_compose up --build -d database
docker_compose up --build --exit-code-from backend backend
EXIT_CODE=$?
echo "EXIT CODE IS $EXIT_CODE"
docker_compose down

# docker_compose kill
# docker_compose down --rmi all --volumes --remove-orphans
# docker_compose down --volumes --remove-orphans