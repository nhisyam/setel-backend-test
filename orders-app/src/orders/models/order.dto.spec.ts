import * as Faker from 'faker'
import { OrderStatus } from "../interfaces/order.interface"
import { createOrderDto } from "./order.dto"
import { Order } from "./order.entity"

describe('when creating orderDto', () => {
  
  it('exclude createdAt', () => {
    expect(createOrderDto(fakeOrder)['createdAt']).toBeUndefined()
  })

  it('exclude updatedAt', () => {
    expect(createOrderDto(fakeOrder)['updatedAt']).toBeUndefined()
  })

  it('include id', () => {
    expect(createOrderDto(fakeOrder)['id']).toBeDefined()
  })

  it('include status', () => {
    expect(createOrderDto(fakeOrder)['status']).toBeDefined()
  })
})

const fakeOrder: Order = {
  createdAt: Faker.date.recent(),
  id: 'abc123',
  status: OrderStatus.Created,
  updatedAt: Faker.date.recent()
}