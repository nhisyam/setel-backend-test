export enum OrderStatus {
  Created = 'created',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Delivered = 'delivered'
}

export interface OrderDto {
  id?: string
  status: OrderStatus
}
