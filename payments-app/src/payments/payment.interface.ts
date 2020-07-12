export enum PaymentStatus {
  Confirmed = 'confirmed',
  Declined = 'declined'
}

export interface PaymentDto {
  id: string
  orderId: string
  status: PaymentStatus
}
