import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/auth/guards/roles.guard';
import { BidsService } from './../src/bids/bids.service';

describe('BidsController (e2e)', () => {
  let app: INestApplication;

  const mockBidsService = {
    createBid: jest.fn().mockResolvedValue({
      id: 'bid-123',
      amount: 100,
      providerId: 'e2e-user',
      orderId: 'order-123',
    }),
    getBidsForOrder: jest.fn().mockResolvedValue([
      { id: 'bid-123', amount: 100, providerId: 'e2e-user', orderId: 'order-123' },
    ]),
    acceptBid: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BidsService)
      .useValue(mockBidsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();

    app.use((req: any, res: any, next: any) => {
      req.user = { userId: 'e2e-user' };
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/orders/:orderId/bids (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/orders/order-123/bids')
      .send({ bidAmountClp: 100, productionDays: 5 })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toEqual('bid-123');
        expect(res.body.amount).toEqual(100);
      });
  });

  it('/api/v1/orders/:orderId/bids (GET)', () => {
    return request(app.getHttpServer() as any)
      .get('/api/v1/orders/order-123/bids')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].id).toEqual('bid-123');
      });
  });

  it('/api/v1/orders/:orderId/bids/:bidId/status (PATCH)', () => {
    return request(app.getHttpServer() as any)
      .patch('/api/v1/orders/order-123/bids/bid-123/status')
      .expect(200)
      .expect({
        ok: true,
        message: 'Bid accepted and others rejected',
      });
  });
});
