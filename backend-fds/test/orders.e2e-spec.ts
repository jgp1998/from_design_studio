import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OrdersService } from './../src/orders/orders.service';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/auth/guards/roles.guard';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  const mockOrdersService = {
    getUploadUrl: jest.fn().mockResolvedValue({ uploadUrl: 'http://s3.local/upload' }),
    createDraftOrder: jest.fn().mockResolvedValue({ id: 'order-123', status: 'Draft' }),
    signNda: jest.fn().mockResolvedValue({ success: true }),
    getDownloadUrl: jest.fn().mockResolvedValue('http://s3.local/download'),
    updateGeometry: jest.fn().mockResolvedValue({ ok: true }),
    updateOrderStatus: jest.fn().mockResolvedValue({ ok: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();

    // Mocking the user request
    app.use((req: any, res: any, next: any) => {
      req.user = { userId: 'e2e-user' };
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/orders/files/presigned-url (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/orders/files/presigned-url')
      .send({ fileName: 'design.stl', fileSizeBytes: 1024 })
      .expect(201)
      .expect({ uploadUrl: 'http://s3.local/upload' });
  });

  it('/api/v1/orders (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/orders')
      .send({ designFileUrl: 'url', materialId: 'm1', quantity: 1 })
      .expect(201)
      .expect({ id: 'order-123', status: 'Draft' });
  });

  it('/api/v1/orders/:id/nda-signatures (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/orders/order-123/nda-signatures')
      .set('user-agent', 'e2e-client')
      .expect(201)
      .expect({ success: true });
  });

  it('/api/v1/orders/:id/files/presigned-download (GET)', () => {
    return request(app.getHttpServer() as any)
      .get('/api/v1/orders/order-123/files/presigned-download')
      .expect(200)
      .expect({ downloadUrl: 'http://s3.local/download' });
  });

  it('/api/v1/orders/:id/geometry (PATCH)', () => {
    return request(app.getHttpServer() as any)
      .patch('/api/v1/orders/order-123/geometry')
      .send({ volumeCm3: 100 })
      .expect(200)
      .expect({ ok: true });
  });

  it('/api/v1/orders/:id/status (PATCH)', () => {
    return request(app.getHttpServer() as any)
      .patch('/api/v1/orders/order-123/status')
      .send({ status: 'In Production' })
      .expect(200)
      .expect({ ok: true });
  });
});
