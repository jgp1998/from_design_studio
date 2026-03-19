import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { BidStatus } from '../common/enums/bid-status.enum';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    private readonly dataSource: DataSource,
  ) {}

  async createCheckoutUrl(
    userId: string,
    orderId: string,
  ): Promise<{ paymentUrl: string }> {
    const order = await this.workOrderRepository.findOne({
      where: { id: orderId },
      relations: ['client', 'bids'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.client.id !== userId) {
      throw new ForbiddenException('You can only pay for your own orders');
    }
    if (order.status !== OrderStatus.ACCEPTED) {
      throw new BadRequestException(
        'Order must be in ACCEPTED state to be paid',
      );
    }

    // Identify accepted bid amount
    const acceptedBid = order.bids.find((b) => b.status === BidStatus.ACCEPTED);
    if (!acceptedBid) {
      throw new BadRequestException('No accepted bid found for this order');
    }

    // FDS Take Rate (Example: 10%)
    const takeRateAmountClp = parseFloat((acceptedBid.bidAmountClp * 0.1).toFixed(2));
    const amountTotalClp = Number(acceptedBid.bidAmountClp) + Number(takeRateAmountClp);
    const providerAmountClp = Number(acceptedBid.bidAmountClp);

    // Mock API Call to MercadoPago / Webpay
    const gatewayId = `MP_MOCK_${Date.now()}`;
    const paymentUrl = `https://mock.mercadopago.com/checkout/preferences/${gatewayId}`;

    const payment = this.paymentRepository.create({
      order,
      gatewayId,
      amountTotalClp,
      takeRateAmountClp,
      providerAmountClp,
      status: PaymentStatus.PENDING,
    });

    await this.paymentRepository.save(payment);

    return { paymentUrl };
  }

  async processWebhook(
    gatewayId: string,

    payload: { status?: string; [key: string]: unknown },
  ): Promise<void> {
    // In real life, verify cryptic signatures here

    await this.dataSource.transaction(async (manager) => {
      const payment = await manager.findOne(Payment, {
        where: { gatewayId },
        relations: ['order'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment) {
        this.logger.error(
          `Webhook received for unknown gatewayId: ${gatewayId}`,
        );
        return; // Return silently to avoid retries from gateway
      }

      if (payment.status === PaymentStatus.SUCCESS) {
        // Already processed
        return;
      }

      // Assume the payload tells us it was approved
      if (payload.status === 'approved') {
        payment.status = PaymentStatus.SUCCESS;
        await manager.save(payment);

        const order = payment.order;
        order.status = OrderStatus.PAID_AND_IN_PRODUCTION;
        await manager.save(order);

        this.logger.log(`Order ${order.id} marked as PAID_AND_IN_PRODUCTION`);
        // We would emit an event here to the provider like "Payment Secured!"
      }
    });
  }
}
