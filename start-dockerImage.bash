#!/bin/bash

set -a
source .env

echo ${NODE_ENV}
echo $1

docker run \
    --name devperftest-docker \
    --detach \
    --rm \
    --publish 5000:5000 \
    --env COMPOSE_VERSION=${COMPOSE_VERSION} \
    --env NODE_ENV=${NODE_ENV} \
    --env PORT=${PORT} \
    --env JWT_SECRET=${JWT_SECRET} \
    --env GMAIL_HOST=${GMAIL_HOST} \
    --env GMAIL_PORT=${GMAIL_PORT} \
    --env GMAIL_USER=${GMAIL_USER} \
    --env GMAIL_PASS=${GMAIL_PASS} \
    --env AZ_APPLICATION_ID=${AZ_APPLICATION_ID} \
    --env AZ_LOCATAIRE_ID=${AZ_LOCATAIRE_ID} \
    --env AZ_SECRET=${AZ_SECRET} \
    --env AZ_REDIRECT_URI=${AZ_REDIRECT_URI} \
    --env DOMAIN_NAME_POC=${DOMAIN_NAME_POC} \
    --env DOMAIN_NAME_DEMO=${DOMAIN_NAME_DEMO} \
    --env DOMAIN_NAME_DEV=${DOMAIN_NAME_DEV} \
    --env DOMAIN_NAME_DOCKER=${DOMAIN_NAME_DOCKER} \
    --env MONGO_URI_POC=${MONGO_URI_POC} \
    --env MONGO_URI_POC_OVH=${MONGO_URI_POC_OVH} \
    --env MONGO_URI_DEMO=${MONGO_URI_DEMO} \
    --env MONGO_URI_DOCKER=${MONGO_URI_DOCKER} \
    --env MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME} \
    --env MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD} \
    --env MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE} \
    --env ME_CONFIG_MONGODB_SERVER=${ME_CONFIG_MONGODB_SERVER} \
    --env ME_CONFIG_MONGODB_ENABLE_ADMIN=${ME_CONFIG_MONGODB_ENABLE_ADMIN} \
    --env ME_CONFIG_MONGODB_ADMINUSERNAME=${ME_CONFIG_MONGODB_ADMINUSERNAME} \
    --env ME_CONFIG_MONGODB_ADMINPASSWORD=${ME_CONFIG_MONGODB_ADMINPASSWORD} \
    --env ME_CONFIG_BASICAUTH_USERNAME=${ME_CONFIG_BASICAUTH_USERNAME} \
    --env ME_CONFIG_BASICAUTH_PASSWORD=${ME_CONFIG_BASICAUTH_PASSWORD} \
    --env MONGO_TARGET=${MONGO_TARGET} \
    $1