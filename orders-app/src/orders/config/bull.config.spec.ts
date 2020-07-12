import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { BullConfig } from './bull.config'

describe('BullConfig', () => {
  let service: BullConfig

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [BullConfig],
    }).compile()

    service = module.get<BullConfig>(BullConfig)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
