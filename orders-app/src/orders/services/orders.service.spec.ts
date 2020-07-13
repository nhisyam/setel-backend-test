import * as Faker from 'faker'
import { Test, TestingModule } from '@nestjs/testing'
import { OrdersService } from './orders.service'
import { OrderStatus } from '../interfaces/order.interface'
import { Order } from '../models/order.entity'

describe('OrdersService', () => {
  let service: OrdersService
  const repo = {
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, {
        provide: 'OrderRepository',
        useValue: repo
      }]
    }).compile()

    service = module.get<OrdersService>(OrdersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('when creating an order', () => {
    it('new order should have status Created', async () => {
      repo.save.mockResolvedValue(fakeOrder)
      const order = await service.create()
      expect(order.status).toEqual(OrderStatus.Created)
    })

    it('if saving order in repo failed, throw exception', async () => {
      repo.save.mockRejectedValueOnce('expected error')
      try {
        await service.create()
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toEqual(new Error('Internal Server Error'))
      }
    })
  })

  describe('when cancelling an order', () => {
    it('order status should be updated to cancelled', async () => {
      repo.findOne.mockResolvedValueOnce(fakeOrder)
      repo.update.mockResolvedValueOnce('')
      const order = await service.cancel(fakeOrder.id)
      expect(order.status).toEqual(OrderStatus.Cancelled)
    })

    it('throw error if failed to update order', async () => {
      repo.findOne.mockResolvedValueOnce(fakeOrder)
      repo.update.mockRejectedValueOnce('expected error')
      try {
        await service.cancel(fakeOrder.id)
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toEqual(new Error('Internal Server Error'))
      }
    })

    it(`throw error if the order couldn't be found`, async () => {
      repo.findOne.mockRejectedValueOnce('expected error')
      try {
        await service.cancel(fakeOrder.id)
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toEqual(new Error('Not Found'))
      }
    })
  })

  describe('when confirming an order', () => {
    it('order status should be updated to delivered', async () => {
      repo.findOne.mockResolvedValueOnce(fakeOrder)
      repo.update.mockResolvedValueOnce('')
      const order = await service.confirm(fakeOrder.id)
      expect(order.status).toEqual(OrderStatus.Delivered)
    })

    it('throw error if failed to update order', async () => {
      repo.findOne.mockResolvedValueOnce(fakeOrder)
      repo.update.mockRejectedValueOnce('expected error')
      try {
        await service.confirm(fakeOrder.id)
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toEqual(new Error('Internal Server Error'))
      }
    })

    it(`throw error if the order couldn't be found`, async () => {
      repo.findOne.mockRejectedValueOnce('expected error')
      try {
        await service.confirm(fakeOrder.id)
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toEqual(new Error('Not Found'))
      }
    })
  })

  describe('when checking status of an order', () => {
    it(`throw error if the order couldn't be found`, async () => {
      repo.findOne.mockRejectedValueOnce('expected error')
      try {
        await service.checkStatus(fakeOrder.id)
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toEqual(new Error('Not Found'))
      }
    })

    it('returns the order status', async () => {
      repo.findOne.mockResolvedValueOnce(fakeOrder)
      const status = await service.checkStatus(fakeOrder.id)
      expect(status).toEqual(fakeOrder.status)
    })
  })
})

const fakeOrder: Order = {
  createdAt: Faker.date.recent(),
  id: Faker.random.uuid(),
  status: OrderStatus.Created,
  updatedAt: Faker.date.recent()
}