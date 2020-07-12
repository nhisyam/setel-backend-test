import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmConfig } from './type-orm.config'
import { ConfigModule } from '@nestjs/config'
import { Repository } from 'typeorm'

describe('TypeOrmConfig', () => {
  let service: TypeOrmConfig

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [TypeOrmConfig,{
        provide: 'OrderRepository',
        useClass: Repository
      }],
    }).compile()

    service = module.get<TypeOrmConfig>(TypeOrmConfig)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
