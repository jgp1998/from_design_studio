import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPaymentsService = {
    createCheckoutUrl: jest.fn(),
    processWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateCheckout', () => {
    it('should call service.createCheckoutUrl', async () => {
      mockPaymentsService.createCheckoutUrl.mockResolvedValue({
        paymentUrl: 'http://test.url',
      });
      const req = { user: { userId: 'client-1' } };
      const res = await controller.generateCheckout(req, 'order-1');
      expect(service.createCheckoutUrl).toHaveBeenCalledWith('client-1', 'order-1');
      expect(res).toEqual({ paymentUrl: 'http://test.url' });
    });
  });

  describe('handlePaymentWebhook', () => {
    it('should call service.processWebhook', async () => {
      mockPaymentsService.processWebhook.mockResolvedValue(undefined);
      const res = await controller.handlePaymentWebhook('gateway-1', { status: 'approved' });
      expect(service.processWebhook).toHaveBeenCalledWith('gateway-1', { status: 'approved' });
      expect(res).toEqual({ ok: true });
    });

    it('should inject fake payload if empty', async () => {
      mockPaymentsService.processWebhook.mockResolvedValue(undefined);
      const res = await controller.handlePaymentWebhook('gateway-1', {});
      expect(service.processWebhook).toHaveBeenCalledWith('gateway-1', { status: 'approved' });
      expect(res).toEqual({ ok: true });
    });
  });
});
