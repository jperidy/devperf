#! /bin/bash

docker rm -f `docker ps -aq -f name=ressource*`
set -a
source .env
echo 'start docker-compose'
cat ${COMPOSE_CONFIG} | envsubst | docker-compose -f - -p "ressource_" up -d