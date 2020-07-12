import { Logger } from '@nestjs/common'
import { Process, OnQueueError, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { PaymentStatus } from '../interfaces/payment.interface'
import { PaymentsService } from '../services/payments.service'
import { OrdersService } from '../services/orders.service'

@Processor('orderCreated')
export class OrderCreatedConsumer {
  private readonly logger = new Logger('OrderCreatedConsumer')

  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService) {
    }

  @Process('processOrder')
  async processOrder(job: Job<string>): Promise<void> {
    const orderId = job.data
    this.logger.log(`Processing order id: ${orderId}`)
    const payment = await this.paymentsService.processOrder(orderId)
    switch (payment.status) {
      case PaymentStatus.Confirmed:
        await this.ordersService.confirm(orderId)
        break
      case PaymentStatus.Declined:
        await this.ordersService.cancel(orderId)
        break
    }
  }

  @OnQueueError()
  handleError(error: Error): void {
    this.logger.error(`Encountered error when processing job from queue: ${error.message}`)
  }
}
