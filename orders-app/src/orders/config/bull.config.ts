import { Injectable } from "@nestjs/common"
import { BullOptionsFactory, BullModuleOptions } from "@nestjs/bull"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class BullConfig implements BullOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createBullOptions(): BullModuleOptions {
    return {      
      redis: {   
        password: this.configService.get<string>('REDIS_PASSWORD') || process.env.REDIS_PASSWORD,     
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT')
      }
    }
  }
}
