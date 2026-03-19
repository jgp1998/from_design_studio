import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OrdersService } from './../src/orders/orders.service';

describe('WebhooksController (e2e)', () => {
  let app: INestApplication;

  const mockOrdersService = {
    markFileAsUploaded: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/webhooks/storage-files (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/webhooks/storage-files')
      .send({
        Records: [
          {
            eventName: 's3:ObjectCreated:Put',
            s3: { object: { key: 'test-file.stl' } },
          },
        ],
      })
      .expect(201)
      .expect({ ok: true });
  });
});
