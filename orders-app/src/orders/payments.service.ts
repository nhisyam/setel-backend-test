import { Injectable, HttpService } from '@nestjs/common'
import { Payment } from './payment.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService){}

  processOrder(orderId: string): Promise<Payment> {
    const url = `${this.configService.get<string>('PAYMENTS_BASE_URL')}/payments/orders/${orderId}`
    return this.httpService.put(url).toPromise().then(response => response.data)
  }
}
