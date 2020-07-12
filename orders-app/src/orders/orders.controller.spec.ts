import { Test, TestingModule } from '@nestjs/testing'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { PaymentsService } from './payments.service'
import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Repository } from 'typeorm'

describe('Orders Controller', () => {
  let controller: OrdersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      controllers: [OrdersController],
      providers: [OrdersService, PaymentsService, {
        provide: 'OrderRepository',
        useClass: Repository
      }]
    }).compile()

    controller = module.get<OrdersController>(OrdersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
