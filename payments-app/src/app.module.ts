import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PaymentsModule } from './payments/payments.module'
import { AuthMiddleware } from './auth.middleware'
import { PaymentsController } from './payments/payments.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./config/.env.development.local', './config/.env.development.minikube'],
      isGlobal: true,
    }),
    PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'payments/(.*)', method: RequestMethod.POST },
        { path: 'payments/(.*)', method: RequestMethod.GET },
        { path: 'payments/(.*)', method: RequestMethod.DELETE },
      )
      .forRoutes(PaymentsController)
  }
  
}
