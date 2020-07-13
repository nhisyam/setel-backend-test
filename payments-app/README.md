# Payments Application

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
# deploy app
$ npm run deploy:app
```

## Sample CURL requests

```bash

# process received order where foobar123 is the order id
curl --request PUT \
  --url http://localhost:3001/payments/orders/foobar123 \
  --header 'content-type: application/json'
  --header 'x-token: <insert token here>'

```

## Stay in touch

- Author - [Nur Hisyam Mohamed](https://twitter.com/nhisyam)