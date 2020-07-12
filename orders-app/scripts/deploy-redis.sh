#!/bin/bash

eval $(minikube -p minikube docker-env)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install orders bitnami/redis