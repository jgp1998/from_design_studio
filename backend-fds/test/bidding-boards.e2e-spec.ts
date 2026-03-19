import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { BiddingBoardsService } from './../src/bidding-boards/bidding-boards.service';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/auth/guards/roles.guard';

describe('BiddingBoardsController (e2e)', () => {
  let app: INestApplication;

  const mockBiddingBoardsService = {
    getOpenOrders: jest.fn().mockResolvedValue({
      items: [{ id: 'order-123', status: 'Awaiting Bids' }],
      total: 1,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BiddingBoardsService)
      .useValue(mockBiddingBoardsService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();

    app.use((req: any, res: any, next: any) => {
      req.user = { userId: 'provider-123' };
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/bidding-boards/orders (GET)', () => {
    return request(app.getHttpServer() as any)
      .get('/api/v1/bidding-boards/orders?page=1&limit=20')
      .expect(200)
      .expect({
        items: [{ id: 'order-123', status: 'Awaiting Bids' }],
        total: 1,
      });
  });
});
