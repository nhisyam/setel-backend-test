import { Order } from "./order.entity"
import { OrderDto } from "../interfaces/order.interface"

export function createOrderDto(order: Order): OrderDto {
  return {
    id: order.id,
    status: order.status
  }
}