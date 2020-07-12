import { Controller, Get, Param, Put, Patch, Query, BadRequestException } from '@nestjs/common'
import { createOrderDto } from './models/order.dto'
import { OrdersService } from './services/orders.service'
import { OrderDto, OrderStatus } from './interfaces/order.interface'

// TODO: Add middleware to handle dummy auth/token check

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id/status')
  async getOrderStatusById(@Param('id') id: string): Promise<OrderDto> {
    return {
      status: await this.ordersService.checkStatus(id)
    }
  }

  @Put()
  async createOrder(): Promise<OrderDto> {    
    return createOrderDto(await this.ordersService.create())
  }

  @Patch(':id')
  async patchOrder(@Param('id') id: string, @Query() query: string): Promise<void> {
    let status: OrderStatus
    for (const queryKey of Object.keys(query)) {
      if (queryKey === 'status') {
        status = query[queryKey]
        break
      }
    }

    if (status !== 'cancelled') {
      throw new BadRequestException()
    }
    
    await this.ordersService.cancel(id)
  }
}
