import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Order } from '../models/order.entity'
import { OrderStatus } from '../interfaces/order.interface'

const ORDER_CREATION_QUEUE_DELAY = 3000

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService')

  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectQueue('orderCreated') private orderCreatedQueue: Queue
  ) {}

  async create(): Promise<Order> {
    const order = new Order()
    order.status = OrderStatus.Created
    await this.ordersRepo.save(order)
    this.logger.debug(`New order created with id: ${order.id}`)
    await this.orderCreatedQueue.add('processOrder', order.id, { delay: ORDER_CREATION_QUEUE_DELAY })
    this.logger.debug(`Order id: ${order.id} has been placed in orderCreatedQueue`)
    return order
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.get(id)
    order.status = OrderStatus.Cancelled
    await this.ordersRepo.update(id, order)
    this.logger.debug(`Order id: ${order.id} updated status: ${order.status}`)
    return order
  }

  async checkStatus(id: string): Promise<OrderStatus> {
    const order = await this.get(id)
    return order.status
  }

  async confirm(id: string): Promise<Order> {
    const order = await this.get(id)
    order.status = OrderStatus.Delivered
    await this.ordersRepo.update(id, order)
    this.logger.debug(`Order id: ${order.id} updated status: ${order.status}`)
    return order
  }

  private async get(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne(id)
    if (!order) {
      this.logger.warn(`Order id: ${id} not found`)
      throw new NotFoundException()
    }
    return order
  }
}
