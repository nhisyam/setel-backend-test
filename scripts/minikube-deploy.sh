#!/bin/bash

# start in fresh state
minikube delete
minikube stop
minikube start

# deploy payments-app
cd payments-app/
npm run deploy:app

cd ..

# deploy orders-app
cd orders-app/
npm run deploy:db
npm run deploy:redis

# injecting the redis password as environment variable 
# todo: inject using secrets
export REDIS_PASSWORD=$(kubectl get secret --namespace default orders-redis -o jsonpath="{.data.redis-password}" | base64 --decode)

npm run deploy:app