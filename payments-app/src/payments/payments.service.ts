import { Injectable, Logger } from '@nestjs/common'
import { PaymentStatus } from './payment.interface'

const MOCK_DELAY_SECONDS = 5*1000

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger('PaymentsService')
  private readonly paymentOrderStatuses = new Map<string, PaymentStatus>()

  async processOrder(orderId: string): Promise<PaymentStatus> {    
    if (this.paymentOrderStatuses.has(orderId)) {
      return this.paymentOrderStatuses.get(orderId)
    }
    const status = this.getPaymentStatus()
    this.paymentOrderStatuses.set(orderId, status)
    this.logger.log(`Processed order id: ${orderId}, status: ${status}`)
    return this.delay<PaymentStatus>(status)
  }
  
  private getPaymentStatus(): PaymentStatus {
    return Math.round(Math.random()) === 1 ? PaymentStatus.Confirmed : PaymentStatus.Declined
  }

  private async delay<V>(T: any): Promise<V> {
    return new Promise(resolve => setTimeout(() => resolve(T), MOCK_DELAY_SECONDS))
  }
 }
