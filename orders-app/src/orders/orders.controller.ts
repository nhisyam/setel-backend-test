import { Controller, Get, Param, Put, Patch, Query, BadRequestException, Logger, Body } from '@nestjs/common'
import { createOrderDto } from './models/order.dto'
import { OrdersService } from './services/orders.service'
import { OrderDto, OrderStatus } from './interfaces/order.interface'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Order } from './models/order.entity'

const ORDER_CREATION_QUEUE_DELAY = 3000
// TODO: Add middleware to handle dummy auth/token check

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger('OrdersController')

  constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue('orderCreated') private orderCreatedQueue: Queue
  ) {}

  @Get(':id/status')
  async getOrderStatusById(@Param('id') id: string): Promise<OrderDto> {
    return {
      status: await this.ordersService.checkStatus(id)
    }
  }

  @Put()
  async createOrder(): Promise<OrderDto> {    
    const order = await this.ordersService.create()
    const orderDto = await createOrderDto(order)
    await this.orderCreatedQueue.add('processOrder', order.id, { delay: ORDER_CREATION_QUEUE_DELAY })
    this.logger.debug(`Order id: ${order.id} has been placed in orderCreatedQueue`)
    return orderDto
  }

  @Patch(':id')
  async patchOrder(@Param('id') id: string, @Body() body: { status: string }): Promise<OrderDto> {
    if (!body.status || body.status !== OrderStatus.Cancelled.toString())  {
      throw new BadRequestException()
    }
    
    const order = await this.ordersService.cancel(id)
    return createOrderDto(order)
  }
}
