#!/bin/bash

TAG=$(date +%Y%m%d-%H%m%S)
docker build -t "$APP_NAME:$TAG" .
helm upgrade --install -f ../infra/values/$APP_NAME.yaml $APP_NAME ../infra/charts/app --set "tag=$TAG"
