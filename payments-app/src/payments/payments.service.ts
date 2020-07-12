import { Injectable } from '@nestjs/common'
import { PaymentStatus } from './interfaces/payment.interface'

const MOCK_DELAY_SECONDS = 1*1000

@Injectable()
export class PaymentsService {
  private readonly paymentOrderStatuses = new Map<string, PaymentStatus>()

  async processOrder(orderId: string): Promise<PaymentStatus> {
    if (this.paymentOrderStatuses.has(orderId)) {
      return this.paymentOrderStatuses.get(orderId)
    }
    const status = this.getPaymentStatus()
    this.paymentOrderStatuses.set(orderId, status)
    return this.delay<PaymentStatus>(status)
  }
  
  private getPaymentStatus(): PaymentStatus {
    return Math.round(Math.random()) === 1 ? PaymentStatus.Confirmed : PaymentStatus.Declined
  }

  private async delay<V>(T: any): Promise<V> {
    return new Promise(resolve => setTimeout(() => resolve(T), MOCK_DELAY_SECONDS))
  }
 }
