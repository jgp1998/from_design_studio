import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ProvidersService } from './../src/providers/providers.service';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from './../src/auth/guards/roles.guard';

describe('ProvidersController (e2e)', () => {
  let app: INestApplication;

  const mockProvidersService = {
    getPresignedUrlUpload: jest.fn().mockResolvedValue({ uploadUrl: 'http://s3.local/upload-doc' }),
    approveProvider: jest.fn().mockResolvedValue({ status: 'Approved' }),
    getDocumentDownloadUrl: jest.fn().mockResolvedValue('http://s3.local/download-doc'),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProvidersService)
      .useValue(mockProvidersService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();

    // Mocking user session
    app.use((req: any, res: any, next: any) => {
      req.user = { userId: 'provider-123' };
      next();
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/providers/documents/presigned-url (GET)', () => {
    return request(app.getHttpServer() as any)
      .get('/api/v1/providers/documents/presigned-url?filename=doc.pdf&type=id_card')
      .expect(200)
      .expect({ uploadUrl: 'http://s3.local/upload-doc' });
  });

  it('/api/v1/admin/providers/:id/status (PATCH)', () => {
    return request(app.getHttpServer() as any)
      .patch('/api/v1/admin/providers/provider-123/status')
      .expect(200)
      .expect({ status: 'Approved' });
  });

  it('/api/v1/admin/providers/:providerId/documents/:documentId (GET)', () => {
    return request(app.getHttpServer() as any)
      .get('/api/v1/admin/providers/provider-123/documents/doc-123')
      .expect(200)
      .expect({ downloadUrl: 'http://s3.local/download-doc' });
  });
});
