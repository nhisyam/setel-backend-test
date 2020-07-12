import { Test, TestingModule } from '@nestjs/testing'
import { OrdersService } from './orders.service'
import { Repository } from 'typeorm'
import { BullModule } from '@nestjs/bull'

describe('OrdersService', () => {
  let service: OrdersService

  beforeEach(async () => {
    const QueueModule = BullModule.registerQueue({
      name: 'test',
    })

    const module: TestingModule = await Test.createTestingModule({
      imports: [QueueModule],
      exports: [QueueModule],
      providers: [OrdersService, {
        provide: 'OrderRepository',
        useClass: Repository
      }]
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
