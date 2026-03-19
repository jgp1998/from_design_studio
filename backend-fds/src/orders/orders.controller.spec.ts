import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    getUploadUrl: jest.fn(),
    createDraftOrder: jest.fn(),
    signNda: jest.fn(),
    getDownloadUrl: jest.fn(),
    updateGeometry: jest.fn(),
    updateOrderStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPresignedUrl', () => {
    it('should call getUploadUrl', async () => {
      mockOrdersService.getUploadUrl.mockResolvedValueOnce({ url: 'url' });
      const res = await controller.getPresignedUrl({ user: { userId: 'u1' } }, 'file.stl', 100);
      expect(mockOrdersService.getUploadUrl).toHaveBeenCalledWith('u1', 'file.stl', 100);
      expect(res).toEqual({ url: 'url' });
    });
  });

  describe('createDraftOrder', () => {
    it('should call createDraftOrder', async () => {
      const dto = { fileId: 'f1', material: 'PLA', color: 'red', infillPercentage: 20 };
      mockOrdersService.createDraftOrder.mockResolvedValueOnce({ id: 'o1' });
      const res = await controller.createDraftOrder({ user: { userId: 'u1' } }, dto);
      expect(mockOrdersService.createDraftOrder).toHaveBeenCalledWith('u1', dto);
      expect(res).toEqual({ id: 'o1' });
    });
  });

  describe('signNda', () => {
    it('should call signNda with the right IP calculation', async () => {
      mockOrdersService.signNda.mockResolvedValueOnce({ id: 'nda1' });
      const res = await controller.signNda({ user: { userId: 'u1' } }, 'o1', 'userAgentX', '1.1.1.1, 2.2.2.2', '0.0.0.0');
      expect(mockOrdersService.signNda).toHaveBeenCalledWith('u1', 'o1', '1.1.1.1', 'userAgentX');
      expect(res).toEqual({ id: 'nda1' });
    });

    it('should fallback to ip if x-forwarded-for is missing', async () => {
      mockOrdersService.signNda.mockResolvedValueOnce({ id: 'nda2' });
      const res = await controller.signNda({ user: { userId: 'u1' } }, 'o1', 'userAgentX', '', '0.0.0.0');
      expect(mockOrdersService.signNda).toHaveBeenCalledWith('u1', 'o1', '0.0.0.0', 'userAgentX');
      expect(res).toEqual({ id: 'nda2' });
    });
  });

  describe('getCdnDownloadUrl', () => {
    it('should return download URL', async () => {
      mockOrdersService.getDownloadUrl.mockResolvedValueOnce('dl-url');
      const res = await controller.getCdnDownloadUrl({ user: { userId: 'u1' } }, 'o1');
      expect(mockOrdersService.getDownloadUrl).toHaveBeenCalledWith('u1', 'o1');
      expect(res).toEqual({ downloadUrl: 'dl-url' });
    });
  });

  describe('updateOrderGeometry', () => {
    it('should update geometry', async () => {
      mockOrdersService.updateGeometry.mockResolvedValueOnce({ id: 'o1' });
      const res = await controller.updateOrderGeometry('o1', { volumeCm3: 15.5 });
      expect(mockOrdersService.updateGeometry).toHaveBeenCalledWith('o1', 15.5);
      expect(res).toEqual({ id: 'o1' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status', async () => {
      const dto = { status: 'PRINTING' as any };
      mockOrdersService.updateOrderStatus.mockResolvedValueOnce({ id: 'o1' });
      const res = await controller.updateOrderStatus({ user: { userId: 'u1' } }, 'o1', dto);
      expect(mockOrdersService.updateOrderStatus).toHaveBeenCalledWith('u1', 'o1', dto);
      expect(res).toEqual({ id: 'o1' });
    });
  });
});
