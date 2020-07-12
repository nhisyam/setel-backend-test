import { Controller, Get, Param, Put, Patch, HttpService, Query, BadRequestException } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrderDto, OrderStatus } from './order.interface'
import { PaymentsService } from './payments.service'
import { PaymentStatus } from './payment.interface'

// TODO: Add middleware to handle dummy auth/token check

@Controller('orders')
export class OrdersController {
  constructor(private readonly httpService: HttpService, 
    private readonly ordersService: OrdersService, 
    private readonly paymentsService: PaymentsService
    ) {}

  @Get(':id')
  getOrderById(@Param('id') id: string): OrderDto {
    return {
      id,
      status: this.ordersService.checkStatus(id)
    } 
  }

  @Put(':id')
  async createOrder(@Param('id') id: string): Promise<OrderDto> {    
    this.ordersService.create(id)

    // TODO: should be async, return immediately.
    // By doing this, introduce a new state called PENDING 
    // which indicates that the order is still in processing, 
    // order status (not yet in cancelled or delivered state )
    const payment = await this.paymentsService.processOrder(id)

    let orderStatus: OrderStatus
    switch (payment.status) {
      case PaymentStatus.Declined:
        orderStatus = this.ordersService.cancel(id)
      case PaymentStatus.Confirmed:
        // TODO: Place in queue, process after X seconds
        // orderStatus = this.ordersService.confirm(id)
    }

    return {
      id,
      status: orderStatus
    }
  }

  @Patch(':id')
  patchOrder(@Param('id') id: string, @Query() query: string): void {
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
    
    this.ordersService.cancel(id)
  }
}
