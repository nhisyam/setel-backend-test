import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

jest.setTimeout(10000)

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  it('/payments (PUT)', () => {
    return request(app.getHttpServer())
      .put('/payments/orders/foobar123')
      .set('x-token', 'ilovechocolate')
      .expect(201)
      .expect((res) => {
        const body = res.body
        if (!body.id) {
          throw new Error('Unexpected body.id')
        } else if (!body.orderId || body.orderId !== 'foobar123') {
          throw new Error('Unexpected body.orderId')
        } else if (!body.status) {
          throw new Error('Unexpected body.status')
        }        
      })
  })
})
