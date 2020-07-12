import { v4 as uuid } from 'uuid'
import { Controller, Param, Put } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { Payment } from './interfaces/payment.interface'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService){}
  
  @Put('orders/:id')
  async processOrder(@Param('id') orderId: string): Promise<Payment> {
    const status = await this.paymentsService.processOrder(orderId)
    return {
      id: uuid(),
      orderId,
      status
    }
  }
}
