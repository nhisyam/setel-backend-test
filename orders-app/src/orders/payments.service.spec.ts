import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsService } from './payments.service'
import { HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

describe('PaymentsService', () => {
  let service: PaymentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [PaymentsService],
    }).compile()

    service = module.get<PaymentsService>(PaymentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
