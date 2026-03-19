import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockAuthService = {
    registerB2B: jest.fn().mockResolvedValue({ id: 'client-123' }),
    registerProvider: jest.fn().mockResolvedValue({ id: 'provider-123' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'mocked-jwt-token' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/registrations/b2b (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/auth/registrations/b2b')
      .send({ email: 'client@company.com', password: 'password', companyRut: '123' })
      .expect(201)
      .expect({ id: 'client-123' });
  });

  it('/api/v1/auth/registrations/provider (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/auth/registrations/provider')
      .send({ email: 'provider@factory.com', password: 'password', companyRut: '789' })
      .expect(201)
      .expect({ id: 'provider-123' });
  });

  it('/api/v1/auth/session (POST)', () => {
    return request(app.getHttpServer() as any)
      .post('/api/v1/auth/session')
      .send({ email: 'client@company.com', password: 'password' })
      .expect(200)
      .expect({ accessToken: 'mocked-jwt-token' });
  });
});
