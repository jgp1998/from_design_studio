import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProviderDocument } from '../users/entities/provider-document.entity';
import { User } from '../users/entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { NotFoundException } from '@nestjs/common';
import { DocumentType } from '../common/enums/document-type.enum';

describe('ProvidersService', () => {
  let service: ProvidersService;

  const mockUsersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockProviderDocumentsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockStorageService = {
    getPresignedUrlUpload: jest.fn().mockResolvedValue('url-up'),
    getPresignedUrlDownload: jest.fn().mockResolvedValue('url-down'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: getRepositoryToken(ProviderDocument), useValue: mockProviderDocumentsRepository },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPresignedUrlUpload', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.getPresignedUrlUpload('usr-1', 'file.pdf', DocumentType.SII_RUT)).rejects.toThrow(NotFoundException);
    });

    it('should create document and return url', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({ id: 'usr-1' });
      mockProviderDocumentsRepository.create.mockReturnValue({ documentType: DocumentType.SII_RUT });
      
      const res = await service.getPresignedUrlUpload('usr-1', 'file.pdf', DocumentType.SII_RUT);
      expect(mockProviderDocumentsRepository.save).toHaveBeenCalled();
      expect(res.url).toBe('url-up');
    });
  });

  describe('approveProvider', () => {
    it('should throw NotFoundException if provider not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.approveProvider('prov-1')).rejects.toThrow(NotFoundException);
    });

    it('should set status to ACTIVE', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({ id: 'prov-1' });
      mockUsersRepository.save.mockResolvedValueOnce({ id: 'prov-1', status: 'ACTIVE' });

      const res = await service.approveProvider('prov-1');
      expect(mockUsersRepository.save).toHaveBeenCalled();
      expect(res.status).toBe('ACTIVE');
    });
  });

  describe('getDocumentDownloadUrl', () => {
    it('should throw NotFoundException if document not found', async () => {
      mockProviderDocumentsRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.getDocumentDownloadUrl('prov', 'doc')).rejects.toThrow(NotFoundException);
    });

    it('should return download url', async () => {
      mockProviderDocumentsRepository.findOne.mockResolvedValueOnce({ storageObjectKey: 'key' });
      const res = await service.getDocumentDownloadUrl('prov', 'doc');
      expect(mockStorageService.getPresignedUrlDownload).toHaveBeenCalledWith('key');
      expect(res).toBe('url-down');
    });
  });
});
