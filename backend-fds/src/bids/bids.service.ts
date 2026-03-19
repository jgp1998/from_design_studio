import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { User } from '../users/entities/user.entity';
import { NdaSignature } from '../orders/entities/nda-signature.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidStatus } from '../common/enums/bid-status.enum';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(NdaSignature)
    private readonly ndaSignatureRepository: Repository<NdaSignature>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createBid(
    providerId: string,
    orderId: string,
    dto: CreateBidDto,
  ): Promise<Bid> {
    // 1. Verify NDA
    const nda = await this.ndaSignatureRepository.findOne({
      where: { provider: { id: providerId }, order: { id: orderId } },
    });
    if (!nda) {
      throw new ForbiddenException('You must sign the NDA before bidding');
    }

    // 2. Concurrency check (Pessimistic Locking is best here since it's a financial transaction,
    // but a simple check is acceptable for this level if the load is moderate. Using a transaction is better).
    // Let's do it in a transaction
    return this.dataSource.transaction(async (manager) => {
      // Find the order with pessimistic lock to prevent race condition if status changes while processing
      const order = await manager.findOne(WorkOrder, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) throw new NotFoundException('Work order not found');
      if (order.status !== OrderStatus.OPEN) {
        throw new ConflictException(
          `Cannot bid on order because it is ${order.status}`,
        );
      }

      // Ensure the provider exists
      const provider = await manager.findOne(User, {
        where: { id: providerId },
      });
      if (!provider) throw new NotFoundException('Provider not found');

      // Create Bid
      const bid = manager.create(Bid, {
        order,
        provider,
        bidAmountClp: dto.bidAmountClp,
        productionDays: dto.productionDays,
        status: BidStatus.PENDING,
      });

      const savedBid = await manager.save(bid);

      // Here later we emit 'BID_CREATED' to RabbitMQ or Redis Pub/Sub

      return savedBid;
    });
  }

  async getBidsForOrder(clientId: string, orderId: string): Promise<any[]> {
    const order = await this.workOrderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.client.id !== clientId) {
      throw new ForbiddenException(
        'You can only view bids for your own orders',
      );
    }

    const bids = await this.bidRepository.find({
      where: { order: { id: orderId } },
      relations: ['provider', 'provider.providerDetails'],
      order: { bidAmountClp: 'ASC' }, // Default order by price
    });

    // 3. Obfuscate identity mapping to pseudonym (Sanitization)
    return bids.map((bid, index) => {
      return {
        id: bid.id,
        bidAmountClp: bid.bidAmountClp,
        productionDays: bid.productionDays,
        status: bid.status,
        createdAt: bid.createdAt,
        providerPseudonym: `Provider ${String.fromCharCode(65 + index)}`, // A, B, C...
        providerRating: bid.provider.providerDetails?.rating ?? 'N/A',
      };
    });
  }

  async acceptBid(
    clientId: string,
    orderId: string,
    bidId: string,
  ): Promise<void> {
    // Verify ownership
    const workOrder = await this.workOrderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!workOrder) throw new NotFoundException('Order not found');
    if (workOrder.client.id !== clientId) {
      throw new ForbiddenException('Only the creator can accept bids');
    }

    if (workOrder.status !== OrderStatus.OPEN) {
      throw new ConflictException('Order is no longer open');
    }

    // Process entirely within an ACID transaction
    await this.dataSource.transaction(async (manager) => {
      // Step 1: Lock the order
      const order = await manager.findOne(WorkOrder, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order)
        throw new NotFoundException('Order not found during transaction');

      // Step 2: Lock the target bid
      const targetBid = await manager.findOne(Bid, {
        where: { id: bidId, order: { id: orderId } },
      });

      if (!targetBid) throw new NotFoundException('Bid not found');

      // Step 3: Update Order to ACCEPTED
      order.status = OrderStatus.ACCEPTED;
      await manager.save(order);

      // Step 4: Accept Target Bid
      targetBid.status = BidStatus.ACCEPTED;
      await manager.save(targetBid);

      // Step 5: Reject other bids silently
      await manager
        .createQueryBuilder()
        .update(Bid)
        .set({ status: BidStatus.REJECTED })
        .where('order_id = :orderId AND id != :bidId', { orderId, bidId })
        .execute();
    });
  }
}
