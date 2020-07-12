#!/bin/bash

eval $(minikube -p minikube docker-env)
TAG=$(date +%Y%m%d-%H%m%S)
docker build -t "$APP_NAME:$TAG" .
helm upgrade --install -f ../infra/values/$APP_NAME.yaml $APP_NAME ../infra/charts/app --set "tag=$TAG" --set "app.container.env[1].value=$REDIS_PASSWORD"
