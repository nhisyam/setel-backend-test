import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsService } from './payments.service'

describe('PaymentsService', () => {
  let service: PaymentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile()

    service = module.get<PaymentsService>(PaymentsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('processOrder', () => {
    describe('if the order has been processed before', () => {
      it('return same status', async () => {
        const statusA = await service.processOrder('1')
        const statusB = await service.processOrder('1')
        expect(statusA).toEqual(statusB)
      })
    })
  })
})
