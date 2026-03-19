import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { DataSource } from 'typeorm';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../common/enums/order-status.enum';
import { BidStatus } from '../common/enums/bid-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPaymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockWorkOrderRepository = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn((cb) => {
      // Mocking the manager used inside the transaction
      const mockManager = {
        findOne: jest.fn(),
        save: jest.fn(),
      };
      return cb(mockManager);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: getRepositoryToken(WorkOrder),
          useValue: mockWorkOrderRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutUrl', () => {
    it('should throw NotFoundException if order is not found', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.createCheckoutUrl('userId', 'orderId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own the order', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'otherUser' },
      });
      await expect(service.createCheckoutUrl('userId', 'orderId')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if order is not ACCEPTED', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'userId' },
        status: OrderStatus.DRAFT,
      });
      await expect(service.createCheckoutUrl('userId', 'orderId')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if accepted bid not found', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'userId' },
        status: OrderStatus.ACCEPTED,
        bids: [{ status: BidStatus.PENDING, bidAmountClp: 10000 }],
      });
      await expect(service.createCheckoutUrl('userId', 'orderId')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return paymentUrl on success', async () => {
      mockWorkOrderRepository.findOne.mockResolvedValueOnce({
        client: { id: 'userId' },
        status: OrderStatus.ACCEPTED,
        bids: [{ status: BidStatus.ACCEPTED, bidAmountClp: 10000 }],
      });
      mockPaymentRepository.create.mockReturnValue({ id: 'payment-id' });
      mockPaymentRepository.save.mockResolvedValueOnce({ id: 'payment-id' });

      const result = await service.createCheckoutUrl('userId', 'orderId');
      expect(result).toHaveProperty('paymentUrl');
      expect(mockPaymentRepository.create).toHaveBeenCalled();
      expect(mockPaymentRepository.save).toHaveBeenCalled();
    });
  });

  describe('processWebhook', () => {
    it('should silently return if payment is not found', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await service.processWebhook('gatewayId', { status: 'approved' });
      expect(mockManager.findOne).toHaveBeenCalled();
    });

    it('should silently return if payment status is already SUCCESS', async () => {
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({ status: PaymentStatus.SUCCESS }),
      };
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));
      await service.processWebhook('gatewayId', { status: 'approved' });
      expect(mockManager.findOne).toHaveBeenCalled();
    });

    it('should update payment and order statuses on success payload', async () => {
      // Implementation tested via transaction mock inside service
      const mockManager = {
        findOne: jest.fn().mockResolvedValue({
          id: 'pay-1',
          status: PaymentStatus.PENDING,
          order: { id: 'order-1', status: OrderStatus.ACCEPTED },
        }),
        save: jest.fn(),
      };
      // Override transaction for this spec
      mockDataSource.transaction.mockImplementationOnce((cb) => cb(mockManager));

      await service.processWebhook('gatewayId', { status: 'approved' });

      expect(mockManager.findOne).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledTimes(2); // One for payment, one for order
    });
  });
});
