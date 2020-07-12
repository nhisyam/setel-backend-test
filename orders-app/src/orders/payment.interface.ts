export enum PaymentStatus {
  Confirmed = 'confirmed',
  Declined = 'declined'
}

export interface Payment {
  id?: string
  orderId: string
  status: PaymentStatus
}
