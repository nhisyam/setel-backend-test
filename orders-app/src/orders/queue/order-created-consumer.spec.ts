import { Test, TestingModule } from '@nestjs/testing'
import { OrderCreatedConsumer } from './order-created-consumer'
import { PaymentsService } from './payments.service'
import { OrdersService } from './orders.service'
import { Repository } from 'typeorm'

describe('OrderCreatedConsumer', () => {
  let provider: OrderCreatedConsumer

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCreatedConsumer, OrdersService, {
        provide: 'OrderRepository',
        useClass: Repository
      }, PaymentsService],
    }).compile()

    provider = module.get<OrderCreatedConsumer>(OrderCreatedConsumer)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
