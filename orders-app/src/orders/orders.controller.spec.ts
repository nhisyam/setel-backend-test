import * as Faker from 'faker'
import { Test, TestingModule } from '@nestjs/testing'
import { OrdersController } from './orders.controller'
import { PaymentsService } from './services/payments.service'
import { HttpModule, NotFoundException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { OrdersService } from './services/orders.service'
import { BullModule } from '@nestjs/bull'
import { OrderStatus } from './interfaces/order.interface'
import { Order } from './models/order.entity'

describe('Orders Controller', () => {
  let controller: OrdersController
  let service: OrdersService
  const fakeProcessor = {
    add: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule, 
        BullModule
      ],
      controllers: [OrdersController],
      providers: [ConfigService, OrdersService, PaymentsService, {
        provide: 'OrderRepository',
        useClass: Repository
      }, {
        provide: 'BullQueue_orderCreated',
        useValue: fakeProcessor
      }]
    }).compile()

    controller = module.get<OrdersController>(OrdersController)
    service = module.get<OrdersService>(OrdersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('GET orders/:id/status', () => {
    it('should return correct dto', async () => {
      const expectedStatus = OrderStatus.Cancelled
      const expected = { status: expectedStatus}
      jest.spyOn(service, 'checkStatus').mockResolvedValue(expectedStatus)
      const actual = await controller.getOrderStatusById('1')
      expect(actual).toEqual(expected)
    })

    it ('should throw error, if service call throws', async () => {
      jest.spyOn(service, 'checkStatus').mockImplementationOnce(() => {
        throw new NotFoundException()
      })
      try {
        await controller.getOrderStatusById('1')        
      } catch(err) {
        expect(err).toBeDefined()
      }      
    })
  })

  describe('PUT orders', () => {
    it('add item to queue when new order created', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(fakeOrder)
      await controller.createOrder()
      expect(fakeProcessor.add).toBeCalledTimes(1)
    })
    it('return correct dto', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(fakeOrder)
      const result = await controller.createOrder()
      expect(result).toEqual({ id: fakeOrder.id, status: fakeOrder.status})
    })
  })

  describe('PATCH orders/:id?state=cancelled', () => {
    it('if status is not "cancelled", return bad request', async () => {
      try {
        await controller.patchOrder('1', { status: 'foobar' })
      } catch (err) {
        expect(err).toBeDefined()
        expect(err).toEqual(new Error('Bad Request'))
      }
    })
    
    it('return correct dto', async () => {
      jest.spyOn(service, 'cancel').mockResolvedValue(fakeOrder)
      const result = await controller.patchOrder('1', { status: 'cancelled' })
      expect(result).toEqual({ id: fakeOrder.id, status: fakeOrder.status})
    })
  })
})

const fakeOrder: Order = {
  createdAt: Faker.date.recent(),
  id: 'abc123',
  status: OrderStatus.Created,
  updatedAt: Faker.date.recent()
}