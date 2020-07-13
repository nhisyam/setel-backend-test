import { Injectable, HttpService, Logger, InternalServerErrorException } from '@nestjs/common'
import { Payment } from '../interfaces/payment.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger('PaymentService')

  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService){}

  processOrder(orderId: string): Promise<Payment> {
    const url = `${this.configService.get<string>('PAYMENTS_BASE_URL')}/payments/orders/${orderId}`
    this.logger.debug(`Sending GET request to ${url}`)
    return this.httpService.put(url).toPromise()
      .then(response => {
        this.logger.debug(`Received response: ${response.status} ${JSON.stringify(response.data)}`)
        return response.data
      })
      .catch(err => {
        this.logger.error('Failed to call payments-app')
        this.logger.error(err)
        throw new InternalServerErrorException()
      })
  }
}
