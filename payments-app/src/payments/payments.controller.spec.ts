import { Test, TestingModule } from '@nestjs/testing'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'

describe('Payments Controller', () => {
  let controller: PaymentsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentsService],
    }).compile()

    controller = module.get<PaymentsController>(PaymentsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('root', () => {
    it('should return valid dto', async () => {
      const result = await controller.processOrder('1')
      expect(result.id).toBeDefined()
      expect(result.orderId).toBeDefined()
      expect(result.status).toBeDefined()
    })
  })
})
