import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderStatus } from './order.interface'
import { Order } from './order.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepo: Repository<Order>) {}
  
  private readonly orderStatuses = new Map<string, OrderStatus>()

  create(id: string): OrderStatus {
    // TODO: Handle duplicated token?
    // 1. Override existing status if token exists
    // 2. Throw error (existing status for given token shouldn't be overidden)
    this.orderStatuses.set(id, OrderStatus.Created)
    return OrderStatus.Created
  }

  cancel(id: string): OrderStatus {
    this.orderStatuses.set(id, OrderStatus.Cancelled)
    return OrderStatus.Cancelled
  }

  checkStatus(id: string): OrderStatus {
    return this.get(id)
  }

  confirm(id: string): OrderStatus {
    this.orderStatuses.set(id, OrderStatus.Delivered)
    return OrderStatus.Delivered
  }

  private get(token: string): OrderStatus {
    const status = this.orderStatuses.get(token)
    if (!status) {
      throw new NotFoundException()
    }
    return status
  }
}
