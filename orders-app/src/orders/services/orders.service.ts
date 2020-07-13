import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { Order } from '../models/order.entity'
import { OrderStatus } from '../interfaces/order.interface'

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService')

  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
  ) {}

  async create(): Promise<Order> {
    const order = new Order()
    order.status = OrderStatus.Created
    this.logger.debug(`New order created with id: ${order.id}`)
    return this.save(order)
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.get(id)    
    order.status = OrderStatus.Cancelled
    await this.update(id, order)
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
    await this.update(id, order)
    this.logger.debug(`Order id: ${order.id} updated status: ${order.status}`)
    return order
  }

  private async get(id: string): Promise<Order | undefined> {
    return this.ordersRepo.findOne(id).catch(err => {
      this.logger.error(`Failed to get order id: ${id}`)
      this.logger.error(err)
      throw new NotFoundException()
    })
  }

  private async update(id: string, order: Order): Promise<UpdateResult> {
    return this.ordersRepo.update(id, order).catch(err => {
      this.logger.error(`Failed to update order: ${order}`)
      this.logger.error(err)
      throw new InternalServerErrorException()
    })
  }

  private async save(order: Order): Promise<Order> {
    return this.ordersRepo.save(order).catch(err => {
      this.logger.error(`Failed to save order: ${order}`)
      this.logger.error(err)
      throw new InternalServerErrorException()
    })
  }
}
