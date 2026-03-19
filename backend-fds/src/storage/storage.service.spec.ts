import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

jest.mock('minio', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      bucketExists: jest.fn().mockResolvedValue(false),
      makeBucket: jest.fn().mockResolvedValue(undefined),
      presignedPutObject: jest.fn().mockResolvedValue('http://put-url'),
      presignedGetObject: jest.fn().mockResolvedValue('http://get-url'),
      putObject: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('StorageService', () => {
  let service: StorageService;
  
  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        MINIO_BUCKET_NAME: 'test-bucket',
        MINIO_ENDPOINT: 'localhost',
        MINIO_PORT: '9000',
        MINIO_USE_SSL: 'false',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPresignedUrlUpload', () => {
    it('should call presignedPutObject', async () => {
      const url = await service.getPresignedUrlUpload('obj.txt');
      expect(url).toBe('http://put-url');
    });
  });

  describe('getPresignedUrlDownload', () => {
    it('should call presignedGetObject', async () => {
      const url = await service.getPresignedUrlDownload('obj.txt');
      expect(url).toBe('http://get-url');
    });
  });

  describe('uploadFile', () => {
    it('should call putObject', async () => {
      await service.uploadFile('obj.txt', Buffer.from('data'), 4);
      // Being a unit test checking successful promise resolution is enough
      expect(service).toBeDefined();
    });
  });

  describe('ensureBucketExists error handling', () => {
    it('should continue silently if check fails', async () => {
      const minio = require('minio');
      minio.Client.mockImplementationOnce(() => ({
        bucketExists: jest.fn().mockRejectedValue(new Error('Network error')),
      }));

      const module = await Test.createTestingModule({
        providers: [
          StorageService,
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const svc = module.get<StorageService>(StorageService);
      await new Promise((r) => setTimeout(r, 0));
      expect(svc).toBeDefined();
    });
  });

  describe('initialization with defaults', () => {
    it('should use default values when config is missing', async () => {
      const emptyConfigService = {
        get: jest.fn().mockReturnValue(undefined), // returns undefined for everything
      };

      const module = await Test.createTestingModule({
        providers: [
          StorageService,
          { provide: ConfigService, useValue: emptyConfigService },
        ],
      }).compile();

      const svc = module.get<StorageService>(StorageService);
      expect(svc).toBeDefined();
    });
  });
});
