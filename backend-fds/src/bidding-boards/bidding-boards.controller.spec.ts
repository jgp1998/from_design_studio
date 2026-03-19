import { Test, TestingModule } from '@nestjs/testing';
import { BiddingBoardsController } from './bidding-boards.controller';
import { BiddingBoardsService } from './bidding-boards.service';

describe('BiddingBoardsController', () => {
  let controller: BiddingBoardsController;
  let service: BiddingBoardsService;

  const mockBiddingBoardsService = {
    getOpenOrders: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiddingBoardsController],
      providers: [
        { provide: BiddingBoardsService, useValue: mockBiddingBoardsService },
      ],
    }).compile();

    controller = module.get<BiddingBoardsController>(BiddingBoardsController);
    service = module.get<BiddingBoardsService>(BiddingBoardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOpenOrders', () => {
    it('should pass parameters correctly to service', async () => {
      mockBiddingBoardsService.getOpenOrders.mockResolvedValueOnce({ items: [] });
      const res = await controller.getOpenOrders(2, 10, 'PLA', '10.5');
      expect(mockBiddingBoardsService.getOpenOrders).toHaveBeenCalledWith(2, 10, 'PLA', 10.5);
      expect(res).toEqual({ items: [] });
    });

    it('should handle undefined minVolume', async () => {
      mockBiddingBoardsService.getOpenOrders.mockResolvedValueOnce({ items: [] });
      const res = await controller.getOpenOrders(1, 20, undefined, undefined);
      expect(mockBiddingBoardsService.getOpenOrders).toHaveBeenCalledWith(1, 20, undefined, undefined);
      expect(res).toEqual({ items: [] });
    });
  });
});
