import { AuthMiddleware } from './auth.middleware'
import { TestingModule, Test } from '@nestjs/testing'

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware
  const config = {
    get: jest.fn().mockReturnValueOnce('hola')
  }
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({    
      providers: [{
        provide: 'ConfigService',
        useValue: config
       },
        AuthMiddleware]
    }).compile()

    middleware = app.get<AuthMiddleware>(AuthMiddleware)
  })
  it('should be defined', () => {
    expect(middleware).toBeDefined()
  })

  it('throw if x-token is missing', () => {
    const req = {    
      method: 'GET',
      url: '/',
      headers: {
        'x': 'foo'
      },      
    } as unknown
    const next = () => { true }
    const res = jest.fn() as unknown
    try {
      middleware.use(req as Request, res as Response, next)
    } catch (err) {
      expect(err).toBeDefined()
    }
  })

  it('call next if x-token is valid', () => {
    const req = {    
      method: 'GET',
      url: '/',
      headers: {
        'x-token': 'hola'
      },      
    } as unknown
    const next = jest.fn()
    const res = jest.fn() as unknown
    middleware.use(req as Request, res as Response, next)
    expect(next).toBeCalledTimes(1)
  })
})
