import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { OrderStatus } from './order.interface'

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  status: OrderStatus

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
