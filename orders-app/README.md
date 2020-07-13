# Orders Application

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Deploy to [minikube](https://minikube.sigs.k8s.io)

```bash
# deploy postgres
$ npm run deploy:db

# deploy redis
$ npm run deploy:redis

# deploy app
$ npm run deploy:app
```

## Sample CURL requests

```bash

# create new order
curl --request PUT \
  --url http://localhost:3000/orders \
  --header 'x-token: <insert token here>'

# get status of an order where 'foobar123' is the orderId
curl --request GET \
  --url http://localhost:3000/orders/foobar123/status \
  --header 'x-token: <insert token here>'

 # cancel an order where 'foobar123' is the orderId
 curl --request PATCH \
  --url http://localhost:3000/orders/foobar123 \
  --header 'content-type: application/json' \
  --header 'x-token: <insert token here>' \
  --data '{
	"status": "cancelled"
}'

```

## Stay in touch

- Author - [Nur Hisyam Mohamed](https://twitter.com/nhisyam)