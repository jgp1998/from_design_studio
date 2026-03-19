import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/auth/guards/roles.guard';
import { PaymentsService } from './../src/payments/payments.service';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;
  const mockPaymentsService = {
    createCheckoutUrl: jest.fn().mockResolvedValue({ paymentUrl: 'http://e2e-payment.url' }),
    processWebhook: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PaymentsService)
      .useValue(mockPaymentsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // Bypassing role checks for simple E2E mock
      .compile();

    app = moduleFixture.createNestApplication();
    
    // Simulating user injection from a guard
    app.use((req: any, res: any, next: any) => {
      req.user = { userId: 'e2e-user' };
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/orders/:orderId/checkouts (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/orders/123/checkouts')
      .expect(201)
      .expect({
        paymentUrl: 'http://e2e-payment.url',
      });
  });

  it('/api/v1/webhooks/payments/:gatewayId (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/webhooks/payments/MP_123')
      .send({ status: 'approved' })
      .expect(201)
      .expect({
        ok: true,
      });
  });
});
