import { v4 as uuid } from 'uuid'
import { Controller, Param, Put } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PaymentDto } from './payment.interface'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService){}
  
  @Put('orders/:id')
  async processOrder(@Param('id') orderId: string): Promise<PaymentDto> {
    const status = await this.paymentsService.processOrder(orderId)
    return {
      id: uuid(),
      orderId,
      status
    }
  }
}
