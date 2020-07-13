import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OrdersModule } from './orders/orders.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from './orders/config/type-orm.config'
import { AuthMiddleware } from './auth.middleware'
import { OrdersController } from './orders/orders.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./config/.env.development.local', './config/.env.development.minikube'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'orders/(.*)', method: RequestMethod.POST },
        { path: 'orders/(.*)', method: RequestMethod.DELETE },
      )
      .forRoutes(OrdersController)
  }
  
}
