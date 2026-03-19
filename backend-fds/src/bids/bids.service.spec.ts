import { Test, TestingModule } from '@nestjs/testing';
import { BidsService } from './bids.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { NdaSignature } from '../orders/entities/nda-signature.entity';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { OrderStatus } from '../common/enums/order-status.enum';

describe('BidsService', () => {
  let service: BidsService;

  const mockBidRepository = {
    find: jest.fn(),
  };

  const mockWorkOrderRepository = {
    findOne: jest.fn(),
  };

  const mockNdaSignatureRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {};

  const mockDataSource = {
    transaction: jest.fn((cb) => {
      const mockManager = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue({ id: 'bid-new' }),
        save: jest.fn().mockResolvedValue({ id: 'bid-new' }),
        createQueryBuilder: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          execute: jest.fn(),
        }),
      };
      
      // We will override this manager's findOne behavior later inside tests if needed
      return cb(mockManager);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BidsService,
        { provide: getRepositoryToken(Bid), useValue: mockBidRepository },
        { provide: getRepositoryToken(WorkOrder), useValue: mockWorkOrderRepository },
        { provide: getRepositoryToken(NdaSignature), useValue: mockNdaSignatureRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<BidsService>(BidsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBid', () => {
    it('should throw ForbiddenException if nda not found', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.createBid('prov', 'order', { bidAmountClp: 100, productionDays: 5 })).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if order not found in transaction', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'nda' });
      const mockManager = {
        findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
      };
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await expect(service.createBid('prov', 'order', { bidAmountClp: 100, productionDays: 5 })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if order is not OPEN', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'nda' });
      const mockManager = {
        findOne: jest.fn().mockImplementation((entity) => {
          if (entity === WorkOrder) return Promise.resolve({ id: 'order', status: OrderStatus.DRAFT });
        }),
      };
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await expect(service.createBid('prov', 'order', { bidAmountClp: 100, productionDays: 5 })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if provider not found', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'nda' });
      const mockManager = {
        findOne: jest.fn().mockImplementation((entity) => {
          if (entity === WorkOrder) return Promise.resolve({ id: 'order', status: OrderStatus.OPEN });
          if (entity === User) return Promise.resolve(null);
        }),
      };
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await expect(service.createBid('prov', 'order', { bidAmountClp: 100, productionDays: 5 })).rejects.toThrow(NotFoundException);
    });

    it('should create bid through transaction on success', async () => {
      mockNdaSignatureRepository.findOne.mockResolvedValueOnce({ id: 'nda' });
      
      const mockManager = {
        findOne: jest.fn().mockImplementation((entity) => {
          if (entity === WorkOrder) {
            return Promise.resolve({ id: 'order', status: OrderStatus.OPEN });
          }
          if (entity === User) {
            return Promise.resolve({ id: 'prov' });
          }
        }),
        create: jest.fn().mockReturnValue({ id: 'bid-new' }),
        save: jest.fn().mockResolvedValue({ id: 'bid-new' }),
      };
      
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      
      const res = await service.createBid('prov', 'order', { bidAmountClp: 100, productionDays: 5 });
      expect(res).toEqual({ id: 'bid-new' });
      expect(mockManager.save).toHaveBeenCalled();
    });
  });

  describe('getBidsForOrder', () => {
    it('should throw NotFoundException if order not found', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.getBidsForOrder('c1', 'o1')).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden if caller is not the client', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({ client: { id: 'other' } });
      await expect(service.getBidsForOrder('c1', 'o1')).rejects.toThrow(ForbiddenException);
    });

    it('should return obfuscated bids', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({ client: { id: 'c1' } });
      mockBidRepository.find.mockResolvedValueOnce([
        { id: 'b1', provider: { providerDetails: { rating: 5 } } },
        { id: 'b2', provider: {} }, // no providerDetails
      ]);

      const res = await service.getBidsForOrder('c1', 'o1');
      expect(res[0].providerPseudonym).toBe('Provider A');
      expect(res[0].providerRating).toBe(5);
      expect(res[1].providerPseudonym).toBe('Provider B');
      expect(res[1].providerRating).toBe('N/A');
    });
  });

  describe('acceptBid', () => {
    it('should throw NotFoundException if order not found', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.acceptBid('c1', 'o1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the client', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'other' },
      });
      await expect(service.acceptBid('c1', 'o1', 'b1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if order is not OPEN', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'c1' },
        status: OrderStatus.DRAFT,
      });
      await expect(service.acceptBid('c1', 'o1', 'b1')).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if order not found during transaction', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'c1' },
        status: OrderStatus.OPEN,
      });
      
      const mockManager = {
        findOne: jest.fn().mockImplementation((entity) => {
          if (entity === WorkOrder) return Promise.resolve(null);
        }),
      };

      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await expect(service.acceptBid('c1', 'o1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if bid not found during transaction', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'c1' },
        status: OrderStatus.OPEN,
      });
      
      const mockManager = {
        findOne: jest.fn().mockImplementation((entity) => {
          if (entity === WorkOrder) return Promise.resolve({ id: 'o1', status: OrderStatus.OPEN });
          if (entity === Bid) return Promise.resolve(null);
        }),
      };

      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await expect(service.acceptBid('c1', 'o1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should process transaction on success', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'c1' },
        status: OrderStatus.OPEN,
      });
      
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(true),
      };

      const mockManager = {
        findOne: jest.fn().mockImplementation((entity) => {
          if (entity === WorkOrder) return Promise.resolve({ id: 'o1', status: OrderStatus.OPEN });
          if (entity === Bid) return Promise.resolve({ id: 'b1', status: 'PENDING' });
        }),
        save: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      };

      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));

      await service.acceptBid('c1', 'o1', 'b1');
      expect(mockManager.save).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});
