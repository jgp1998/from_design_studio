import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderFile } from './entities/work-order-file.entity';
import { NdaSignature } from './entities/nda-signature.entity';
import { OrderStateHistory } from './entities/order-state-history.entity';
import { User } from '../users/entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { BidStatus } from '../common/enums/bid-status.enum';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockWorkOrderRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockWorkOrderFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockNdaSignatureRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOrderStateHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockStorageService = {
    getPresignedUrlUpload: jest.fn(),
    getPresignedUrlDownload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(WorkOrder), useValue: mockWorkOrderRepository },
        { provide: getRepositoryToken(WorkOrderFile), useValue: mockWorkOrderFileRepository },
        { provide: getRepositoryToken(NdaSignature), useValue: mockNdaSignatureRepository },
        { provide: getRepositoryToken(OrderStateHistory), useValue: mockOrderStateHistoryRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUploadUrl', () => {
    it('should throw if file exceeds 50MB', async () => {
      await expect(service.getUploadUrl('1', 'f.stl', 51 * 1024 * 1024)).rejects.toThrow(BadRequestException);
    });
    it('should throw if file is not stl or step', async () => {
      await expect(service.getUploadUrl('1', 'f.txt', 100)).rejects.toThrow(BadRequestException);
    });
    it('should create url', async () => {
      mockStorageService.getPresignedUrlUpload.mockResolvedValueOnce('url');
      mockWorkOrderFileRepository.create.mockReturnValue({ id: 'fid' });
      mockWorkOrderFileRepository.save.mockResolvedValueOnce({ id: 'fid' });
      const res = await service.getUploadUrl('1', 'f.stl', 100);
      expect(res.url).toBe('url');
      expect(res.fileId).toBe('fid');
    });
  });

  describe('markFileAsUploaded', () => {
    it('should update file status', async () => {
      mockWorkOrderFileRepository.findOne.mockResolvedValueOnce({ isUploaded: false });
      await service.markFileAsUploaded('key');
      expect(mockWorkOrderFileRepository.save).toHaveBeenCalled();
    });
  });

  describe('createDraftOrder', () => {
    it('should throw if file not found', async () => {
      mockWorkOrderFileRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.createDraftOrder('1', { fileId: '1', material: 'x', color: 'x', infillPercentage: 1 })).rejects.toThrow(NotFoundException);
    });
    it('should throw if file not uploaded', async () => {
      mockWorkOrderFileRepository.findOne.mockResolvedValueOnce({ isUploaded: false });
      await expect(service.createDraftOrder('1', { fileId: '1', material: 'x', color: 'x', infillPercentage: 1 })).rejects.toThrow(BadRequestException);
    });
    it('should throw if user not found', async () => {
      mockWorkOrderFileRepository.findOne.mockResolvedValueOnce({ isUploaded: true });
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.createDraftOrder('1', { fileId: '1', material: 'x', color: 'x', infillPercentage: 1 })).rejects.toThrow(NotFoundException);
    });
    it('should create order', async () => {
      mockWorkOrderFileRepository.findOne.mockResolvedValueOnce({ isUploaded: true });
      mockUserRepository.findOne.mockResolvedValueOnce({ id: '1' });
      mockWorkOrderRepository.create.mockReturnValue({ id: 'o1' });
      mockWorkOrderRepository.save.mockResolvedValueOnce({ id: 'o1' });
      const res = await service.createDraftOrder('1', { fileId: '1', material: 'x', color: 'x', infillPercentage: 1 });
      expect(res).toEqual({ id: 'o1' });
    });
  });

  describe('signNda', () => {
    it('should throw if provider or order not found', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.signNda('1', '1', 'ip', 'ua')).rejects.toThrow(NotFoundException);
    });
    it('should return existing sig', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ id: '1' });
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({ id: '1' });
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'sig1' });
      const res = await service.signNda('1', '1', 'ip', 'ua');
      expect(res).toEqual({ id: 'sig1' });
    });
    it('should create new sig', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ id: '1' });
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({ id: '1' });
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce(null);
      mockNdaSignatureRepository.create.mockReturnValue({ id: 'sig2' });
      mockNdaSignatureRepository.save.mockResolvedValueOnce({ id: 'sig2' });
      const res = await service.signNda('1', '1', 'ip', 'ua');
      expect(res).toEqual({ id: 'sig2' });
    });
  });

  describe('getDownloadUrl', () => {
    it('should throw if nda not signed', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.getDownloadUrl('1', '1')).rejects.toThrow(ForbiddenException);
    });
    it('should throw if order has no files', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'sig1' });
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.getDownloadUrl('1', '1')).rejects.toThrow(NotFoundException);
    });
    it('should return url', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'sig1' });
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({ files: [{ storageObjectKey: 'k1' }] });
      mockStorageService.getPresignedUrlDownload.mockResolvedValueOnce('url1');
      const res = await service.getDownloadUrl('1', '1');
      expect(res).toBe('url1');
    });
  });

  describe('updateGeometry', () => {
    it('should throw if order not found', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.updateGeometry('1', 1)).rejects.toThrow(NotFoundException);
    });
    it('should update geometry', async () => {
      const ord = { id: '1', status: OrderStatus.DRAFT, volumeCm3: null };
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(ord);
      mockWorkOrderRepository.save.mockResolvedValueOnce({ ...ord, volumeCm3: 10, status: OrderStatus.OPEN });
      const res = await service.updateGeometry('1', 10);
      expect(res.status).toBe(OrderStatus.OPEN);
      expect(res.volumeCm3).toBe(10);
    });
  });

  describe('updateOrderStatus (FSM)', () => {
    it('should throw NotFoundException if order does not exist', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.updateOrderStatus('providerId', 'orderId', { status: OrderStatus.PRINTING })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the accepted provider', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        id: 'orderId',
        status: OrderStatus.PAID_AND_IN_PRODUCTION,
        bids: [{ status: BidStatus.ACCEPTED, provider: { id: 'otherProvider' } }],
      });
      await expect(service.updateOrderStatus('providerId', 'orderId', { status: OrderStatus.PRINTING })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException on invalid transition', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        id: 'orderId',
        status: OrderStatus.PRINTING, // Cannot jump to PRINTING to DISPATCHED without QUALITY_CHECK
        bids: [{ status: BidStatus.ACCEPTED, provider: { id: 'providerId' } }],
      });
      await expect(service.updateOrderStatus('providerId', 'orderId', { status: OrderStatus.DISPATCHED })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if missing tracking info for DISPATCHED state', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        id: 'orderId',
        status: OrderStatus.QUALITY_CHECK,
        bids: [{ status: BidStatus.ACCEPTED, provider: { id: 'providerId' } }],
      });
      await expect(
        service.updateOrderStatus('providerId', 'orderId', { status: OrderStatus.DISPATCHED }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully update status and create state history entry', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        id: 'orderId',
        status: OrderStatus.PRINTING,
        bids: [{ status: BidStatus.ACCEPTED, provider: { id: 'providerId' } }],
      });
      mockWorkOrderRepository.save.mockResolvedValueOnce({});
      mockOrderStateHistoryRepository.create.mockReturnValue({});
      mockOrderStateHistoryRepository.save.mockResolvedValueOnce({});

      const testDto = { status: OrderStatus.QUALITY_CHECK };
      await service.updateOrderStatus('providerId', 'orderId', testDto);

      expect(mockWorkOrderRepository.save).toHaveBeenCalled();
      expect(mockOrderStateHistoryRepository.create).toHaveBeenCalledWith({
        order: expect.anything(),
        previousStatus: OrderStatus.PRINTING,
        newStatus: OrderStatus.QUALITY_CHECK,
        changedByUserId: 'providerId',
      });
      expect(mockOrderStateHistoryRepository.save).toHaveBeenCalled();
    });

    it('should successfully update status to DISPATCHED and assign tracking info', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        id: 'orderId',
        status: OrderStatus.QUALITY_CHECK,
        bids: [{ status: BidStatus.ACCEPTED, provider: { id: 'providerId' } }],
      });
      mockWorkOrderRepository.save.mockResolvedValueOnce({});
      mockOrderStateHistoryRepository.create.mockReturnValue({});
      mockOrderStateHistoryRepository.save.mockResolvedValueOnce({});

      const testDto = { status: OrderStatus.DISPATCHED, trackingNumber: 'TRK123', courier: 'Fedex' };
      const order = await service.updateOrderStatus('providerId', 'orderId', testDto);

      expect(order.status).toBe(OrderStatus.DISPATCHED);
      expect(order.trackingNumber).toBe('TRK123');
      expect(order.courier).toBe('Fedex');
    });
  });
});
