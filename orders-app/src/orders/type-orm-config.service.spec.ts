import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmConfigService } from './type-orm-config.service'
import { ConfigModule } from '@nestjs/config'
import { Repository } from 'typeorm'

describe('TypeOrmConfigService', () => {
  let service: TypeOrmConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [TypeOrmConfigService,{
        provide: 'OrderRepository',
        useClass: Repository
      }],
    }).compile()

    service = module.get<TypeOrmConfigService>(TypeOrmConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
