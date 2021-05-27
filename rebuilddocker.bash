#! /bin/bash

docker rmi $1
docker build -t $1 .
docker push $1