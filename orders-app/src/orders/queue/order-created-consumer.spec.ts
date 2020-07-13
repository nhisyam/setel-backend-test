import * as Faker from 'faker'
import { Test, TestingModule } from '@nestjs/testing'
import { OrderCreatedConsumer } from './order-created-consumer'
import { Repository } from 'typeorm'
import { OrdersService } from '../services/orders.service'
import { PaymentsService } from '../services/payments.service'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/common'
import { Job } from 'bull'
import { Payment, PaymentStatus } from '../interfaces/payment.interface'

describe('OrderCreatedConsumer', () => {
  let provider: OrderCreatedConsumer
  let paymentsService: PaymentsService
  const ordersService = {
    confirm: jest.fn(),
    cancel: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        OrderCreatedConsumer, 
        {
          provide: 'OrdersService',
          useValue: ordersService
        }, 
        {
          provide: 'OrderRepository',
          useClass: Repository
        },
        PaymentsService
      ],
    }).compile()

    provider = module.get<OrderCreatedConsumer>(OrderCreatedConsumer)
    paymentsService = module.get<PaymentsService>(PaymentsService)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  describe('when processOrder is called', () => {
    describe('when payment status is confirmed', () => {
      it('should be delivered', async () => {
        jest.spyOn(paymentsService, 'processOrder')
          .mockResolvedValue(
            createFakePayment('foobar', PaymentStatus.Confirmed)
          )
        await provider.processOrder({ data: 'foobar'} as Job<string>)
        expect(ordersService.confirm).toHaveBeenCalledWith('foobar')
      })
    })
    describe('when payment status is declined', () => {
      it('should be cancelled', async () => {
        jest.spyOn(paymentsService, 'processOrder')
          .mockResolvedValue(
            createFakePayment('foobar', PaymentStatus.Declined)
          )
        await provider.processOrder({ data: 'foobar'} as Job<string>)
        expect(ordersService.cancel).toHaveBeenCalledWith('foobar')
      })
    })
  })
})

const createFakePayment = (orderId: string, status: PaymentStatus): Payment => {
  return {
    orderId,
    status,
    id: Faker.random.uuid()
  }
}
