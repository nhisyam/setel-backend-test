# Setel BE Nodejs Order Management

## Description

### Requirement

Build 2 small applications (micro-services) written with any modern NodeJS Framework. Each of the services should have own purpose of existing and single responsibility.

#### Orders Application

  * Responsible for orders management
  * Each order can be at the single state at the time
  * Order states - created, confirmed, delivered, cancelled
  * After order was created Orders App should trigger Payments App call to process a payment for the current order. (Assuming that Orders already store an Auth information of the user, so you can send dummy PIN, Token, whatever)
  * An Application should have API endpoints to:
    * create an order
    * cancel an order
    * check order status

#### Payments Application
  * Responsible for payment processing
  * Payments App should handle requests by Order App to verify payment transaction and confirmed or declined an order.
  * The logic behind the payment processing should be mocked and return a random result to the Orders App.    

#### General scenario

  * Calling Orders App endpoint to create an Order
  * An order should be created in DB with the created state
  * Orders App makes a call to Payment App with the order information and mocked auth details.
  * Payment App processes an order (logic can be mocked) and returns random response confirmed or declined
  * Orders App updates order based on the response from the Payments App
    * declined ⇒ moves order to the canceled state
    * confirmed ⇒ moves order to the confirmed state
  * After X amount of seconds confirmed orders should automatically be moved to the delivered state.

---------------

### Additional notes / enhancements

  * Use a queue to manage the orders. Allows potential larger scalability, where high number of orders can be handled easily. In this repo, I'm using bull library which relies on Redis. This can be replaced with Amazon Simple Queue System (SQS).
  * For this repo, I'm using postgres to store the orders data. This can be replaced with Amazon DynamoDB since there is not much use of joins and the data stored is flat.
  * Created the application using NestJs. I find it easy to use and pretty straightforward. Plenty of documentations and examples around. (I have never used this framework before).
  * Created deployment against minikube (small kubernetes) using helm which runs locally on my machine. This is easily changed to run on actual k8s cluster if needed.

---

## Installation against [minikube](https://minikube.sigs.k8s.io)

```bash
# start everything from clean slate
$ ./scripts/minikube-deploy.sh
```

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)