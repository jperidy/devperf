#!/bin/bash

docker rm -f -v `docker ps -aq -f name=devpdc_*`
set -a
source .env
cat ${COMPOSE_CONFIG} | envsubst | docker-compose -f - -p "myproject" up -d