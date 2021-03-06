#!/bin/bash

eval $(minikube -p minikube docker-env)
TAG=$(date +%Y%m%d-%H%m%S)
helm upgrade --install -f ../infra/values/postgres.yaml postgres ../infra/charts/postgres --set "tag=$TAG"
