import { Module, HttpModule } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { PaymentsService } from './payments.service'
import { ConfigModule } from '@nestjs/config'
import { Order } from './order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentsService]
})
export class OrdersModule {}
