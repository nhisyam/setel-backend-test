import * as Faker from 'faker'
import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsService } from './payments.service'
import { HttpModule, HttpService } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { of } from 'rxjs'
import { PaymentStatus } from '../interfaces/payment.interface'

describe('PaymentsService', () => {
  let service: PaymentsService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [PaymentsService],
    }).compile()

    service = module.get<PaymentsService>(PaymentsService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('when calling payments-app', () => {
    it('throw error when failed to make a call', async () => {
      try {
        await service.processOrder(Faker.random.uuid())
      } catch(err) {
        expect(err).toBeDefined()
        expect(err).toEqual(new Error('Internal Server Error'))
      }
    })
    it('return the data received', async () => {
      const response = {
        data: {
          id: Faker.random.uuid(),
          orderId: Faker.random.uuid(),
          status: PaymentStatus.Confirmed,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      }
      jest.spyOn(httpService, 'put').mockImplementationOnce(() => of(response))
      const payment = await service.processOrder(Faker.random.uuid())
      expect(payment.id).toEqual(response.data.id)
      expect(payment.orderId).toEqual(response.data.orderId)
      expect(payment.status).toEqual(response.data.status)
    })
  })
})
