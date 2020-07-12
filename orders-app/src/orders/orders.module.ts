import { Module, HttpModule } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { PaymentsService } from './services/payments.service'
import { ConfigModule } from '@nestjs/config'
import { Order } from './models/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'
import { BullConfig } from './config/bull.config'
import { OrderCreatedConsumer } from './queue/order-created-consumer'
import { OrdersService } from './services/orders.service'

@Module({
  imports: [
    ConfigModule, 
    HttpModule, 
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueueAsync({
      name: 'orderCreated',
      useClass: BullConfig
    })
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentsService, OrderCreatedConsumer]
})
export class OrdersModule {}
