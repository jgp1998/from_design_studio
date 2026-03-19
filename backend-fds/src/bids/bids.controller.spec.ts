import { Test, TestingModule } from '@nestjs/testing';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';

describe('BidsController', () => {
  let controller: BidsController;
  let service: BidsService;

  const mockBidsService = {
    createBid: jest.fn(),
    getBidsForOrder: jest.fn(),
    acceptBid: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BidsController],
      providers: [
        { provide: BidsService, useValue: mockBidsService },
      ],
    }).compile();

    controller = module.get<BidsController>(BidsController);
    service = module.get<BidsService>(BidsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call createBid', async () => {
      mockBidsService.createBid.mockResolvedValueOnce({ id: 'b1' });
      const dto = { bidAmountClp: 100, productionDays: 5 };
      const res = await controller.create({ user: { userId: 'u1' } }, 'o1', dto);
      expect(mockBidsService.createBid).toHaveBeenCalledWith('u1', 'o1', dto);
      expect(res).toEqual({ id: 'b1' });
    });
  });

  describe('findAll', () => {
    it('should call getBidsForOrder', async () => {
      mockBidsService.getBidsForOrder.mockResolvedValueOnce([]);
      const res = await controller.findAll({ user: { userId: 'u1' } }, 'o1');
      expect(mockBidsService.getBidsForOrder).toHaveBeenCalledWith('u1', 'o1');
      expect(res).toEqual([]);
    });
  });

  describe('acceptBid', () => {
    it('should call acceptBid', async () => {
      mockBidsService.acceptBid.mockResolvedValueOnce(undefined);
      const res = await controller.acceptBid({ user: { userId: 'u1' } }, 'o1', 'b1');
      expect(mockBidsService.acceptBid).toHaveBeenCalledWith('u1', 'o1', 'b1');
      expect(res).toEqual({ ok: true, message: 'Bid accepted and others rejected' });
    });
  });
});
