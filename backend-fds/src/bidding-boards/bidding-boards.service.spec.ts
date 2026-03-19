import { Test, TestingModule } from '@nestjs/testing';
import { BiddingBoardsService } from './bidding-boards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { OrderStatus } from '../common/enums/order-status.enum';

describe('BiddingBoardsService', () => {
  let service: BiddingBoardsService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockWorkOrderRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiddingBoardsService,
        { provide: getRepositoryToken(WorkOrder), useValue: mockWorkOrderRepository },
      ],
    }).compile();

    service = module.get<BiddingBoardsService>(BiddingBoardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOpenOrders', () => {
    it('should build query without optional params', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[], 0]);
      
      const res = await service.getOpenOrders();
      expect(mockWorkOrderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('order.status = :status', { status: OrderStatus.OPEN });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(0);
      expect(res.total).toBe(0);
    });

    it('should build query with material and minVolume', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[{ id: '1' }], 1]);
      
      const res = await service.getOpenOrders(2, 5, 'PLA', 100);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('order.material = :material', { material: 'PLA' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('order.volumeCm3 >= :minVolume', { minVolume: 100 });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(res.items).toHaveLength(1);
      expect(res.totalPages).toBe(1);
      expect(res.page).toBe(2);
    });
  });
});
