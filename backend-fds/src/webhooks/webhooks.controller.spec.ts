import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { OrdersService } from '../orders/orders.service';

describe('WebhooksController', () => {
  let controller: WebhooksController;

  const mockOrdersService = {
    markFileAsUploaded: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    controller = module.get<WebhooksController>(WebhooksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleMinioEvent', () => {
    it('should ignore if no Records', async () => {
      const res = await controller.handleMinioEvent({} as any);
      expect(mockOrdersService.markFileAsUploaded).not.toHaveBeenCalled();
      expect(res).toEqual({ ok: true });
    });

    it('should ignore if eventName not matching', async () => {
      const res = await controller.handleMinioEvent({ Records: [{ eventName: 's3:ObjectRemoved' } as any] });
      expect(mockOrdersService.markFileAsUploaded).not.toHaveBeenCalled();
      expect(res).toEqual({ ok: true });
    });

    it('should call markFileAsUploaded if event matches', async () => {
      const payload = {
        Records: [
          { eventName: 's3:ObjectCreated:Put', s3: { object: { key: 'test/file.stl' } } }
        ]
      };
      const res = await controller.handleMinioEvent(payload);
      expect(mockOrdersService.markFileAsUploaded).toHaveBeenCalledWith('test/file.stl');
      expect(res).toEqual({ ok: true });
    });
  });
});
