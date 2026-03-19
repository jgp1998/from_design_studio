import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

describe('ProvidersController', () => {
  let controller: ProvidersController;
  let service: ProvidersService;

  const mockProvidersService = {
    getPresignedUrlUpload: jest.fn(),
    approveProvider: jest.fn(),
    getDocumentDownloadUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [
        { provide: ProvidersService, useValue: mockProvidersService },
      ],
    }).compile();

    controller = module.get<ProvidersController>(ProvidersController);
    service = module.get<ProvidersService>(ProvidersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPresignedUrl', () => {
    it('should throw Error if missing queries', async () => {
      await expect(controller.getPresignedUrl({ user: { userId: '1' } }, '', null as any)).rejects.toThrow();
    });

    it('should return url', async () => {
      mockProvidersService.getPresignedUrlUpload.mockResolvedValueOnce({ url: 'xx', key: 'yy' });
      const res = await controller.getPresignedUrl({ user: { userId: '1' } }, 'doc.pdf', 'SII_RUT' as any);
      expect(mockProvidersService.getPresignedUrlUpload).toHaveBeenCalledWith('1', 'doc.pdf', 'SII_RUT');
      expect(res).toEqual({ url: 'xx', key: 'yy' });
    });
  });

  describe('approveProviderStatus', () => {
    it('should call approveProvider', async () => {
      mockProvidersService.approveProvider.mockResolvedValueOnce({ id: '1' });
      const res = await controller.approveProviderStatus('1');
      expect(mockProvidersService.approveProvider).toHaveBeenCalledWith('1');
      expect(res).toEqual({ id: '1' });
    });
  });

  describe('downloadProviderDocument', () => {
    it('should call getDocumentDownloadUrl', async () => {
      mockProvidersService.getDocumentDownloadUrl.mockResolvedValueOnce('url');
      const res = await controller.downloadProviderDocument('p1', 'd1');
      expect(mockProvidersService.getDocumentDownloadUrl).toHaveBeenCalledWith('p1', 'd1');
      expect(res).toEqual({ downloadUrl: 'url' });
    });
  });
});
