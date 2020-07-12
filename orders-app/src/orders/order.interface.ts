export enum OrderStatus {
  Created = 'created',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Delivered = 'delivered'
}

export interface OrderDto extends OrderPatchDto {
  id: string
}

export interface OrderPatchDto {
  status: OrderStatus
}
