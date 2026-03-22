import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderFile } from './entities/work-order-file.entity';
import { NdaSignature } from './entities/nda-signature.entity';
import { OrderStateHistory } from './entities/order-state-history.entity';
import { User } from '../users/entities/user.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { BidStatus } from '../common/enums/bid-status.enum';
import { StorageService } from '../storage/storage.service';
import { CreateOrderDraftDto } from './dto/create-order-draft.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(WorkOrderFile)
    private readonly workOrderFileRepository: Repository<WorkOrderFile>,
    @InjectRepository(NdaSignature)
    private readonly ndaSignatureRepository: Repository<NdaSignature>,
    @InjectRepository(OrderStateHistory)
    private readonly orderStateHistoryRepository: Repository<OrderStateHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
  ) {}

  async getUploadUrl(
    userId: string,
    fileName: string,
    fileSizeBytes: number,
  ): Promise<{ url: string; key: string; fileId: string }> {
    if (fileSizeBytes > 50 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 50MB limit');
    }

    // Usually checking the file extension here as well
    if (
      !fileName.toLowerCase().endsWith('.stl') &&
      !fileName.toLowerCase().endsWith('.step')
    ) {
      throw new BadRequestException('Only .STL and .STEP files are allowed');
    }

    const key = `orders/${userId}/${Date.now()}_${fileName}`;
    const url = await this.storageService.getPresignedUrlUpload(key);

    const file = this.workOrderFileRepository.create({
      storageObjectKey: key,
      fileName,
      fileSizeBytes,
      isUploaded: false,
    });
    const savedFile = await this.workOrderFileRepository.save(file);

    return { url, key, fileId: savedFile.id };
  }

  async markFileAsUploaded(storageObjectKey: string): Promise<void> {
    const file = await this.workOrderFileRepository.findOne({
      where: { storageObjectKey },
    });
    if (file) {
      file.isUploaded = true;
      await this.workOrderFileRepository.save(file);
      // Here we could emit an event for the Python asynchronous worker
    }
  }

  async getClientOrders(clientId: string): Promise<WorkOrder[]> {
    return this.workOrderRepository.find({
      where: { client: { id: clientId } },
      relations: ['files', 'bids', 'bids.provider'],
      order: { createdAt: 'DESC' },
    });
  }

  async createDraftOrder(
    userId: string,
    dto: CreateOrderDraftDto,
  ): Promise<WorkOrder> {
    const file = await this.workOrderFileRepository.findOne({
      where: { id: dto.fileId },
    });
    if (!file) throw new NotFoundException('File not found');
    if (!file.isUploaded)
      throw new BadRequestException('File has not finished uploading');

    const client = await this.userRepository.findOne({ where: { id: userId } });
    if (!client) throw new NotFoundException('User not found');

    const order = this.workOrderRepository.create({
      client,
      status: OrderStatus.DRAFT,
      material: dto.material,
      color: dto.color,
      infillPercentage: dto.infillPercentage,
      files: [file],
    });

    const savedOrder = await this.workOrderRepository.save(order);

    // Update the file to reference the order
    file.order = savedOrder;
    await this.workOrderFileRepository.save(file);

    // Normally emit another event for Python geometric parsing here

    return savedOrder;
  }

  async signNda(
    providerId: string,
    orderId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<NdaSignature> {
    const provider = await this.userRepository.findOne({
      where: { id: providerId },
    });
    const order = await this.workOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!provider || !order)
      throw new NotFoundException('Provider or Order not found');

    const existingSignature = await this.ndaSignatureRepository.findOne({
      where: { provider: { id: providerId }, order: { id: orderId } },
    });

    if (existingSignature) return existingSignature;

    const hashFingerprint = `NDA_${providerId}_${orderId}_${Date.now()}`;

    const signature = this.ndaSignatureRepository.create({
      provider,
      order,
      ipAddress,
      userAgent,
      hashFingerprint,
    });

    return this.ndaSignatureRepository.save(signature);
  }

  async getDownloadUrl(providerId: string, orderId: string): Promise<string> {
    const signature = await this.ndaSignatureRepository.findOne({
      where: { provider: { id: providerId }, order: { id: orderId } },
    });

    if (!signature) {
      throw new ForbiddenException('NDA not signed for this order');
    }

    const order = await this.workOrderRepository.findOne({
      where: { id: orderId },
      relations: ['files'],
    });

    if (!order || !order.files || order.files.length === 0) {
      throw new NotFoundException('Order or files not found');
    }

    // Returning the first file URL for visualization/download
    // Short expiry time for secure view (e.g., 5-10 minutes)
    return this.storageService.getPresignedUrlDownload(
      order.files[0].storageObjectKey,
      600,
    );
  }

  async updateGeometry(orderId: string, volumeCm3: number): Promise<WorkOrder> {
    const order = await this.workOrderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    order.volumeCm3 = volumeCm3;
    if (order.status === OrderStatus.DRAFT) {
      order.status = OrderStatus.OPEN;
    }
    return this.workOrderRepository.save(order);
  }

  // FSM Logic and Tracking Log
  async updateOrderStatus(
    providerId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ): Promise<WorkOrder> {
    const order = await this.workOrderRepository.findOne({
      where: { id: orderId },
      relations: ['bids', 'bids.provider'],
    });

    if (!order) throw new NotFoundException('Order not found');

    const acceptedBid = order.bids.find((b) => b.status === BidStatus.ACCEPTED);
    if (!acceptedBid || acceptedBid.provider.id !== providerId) {
      throw new ForbiddenException(
        'Only the accepted provider can update the logistics status',
      );
    }

    const previousStatus = order.status;
    const ns = dto.status;

    // FSM Rules
    const allowedTransitions: Record<string, string[]> = {
      [OrderStatus.PAID_AND_IN_PRODUCTION]: [
        OrderStatus.PRINTING,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.PRINTING]: [
        OrderStatus.QUALITY_CHECK,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.QUALITY_CHECK]: [
        OrderStatus.DISPATCHED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.DISPATCHED]: [OrderStatus.COMPLETED],
    };

    if (
      !allowedTransitions[previousStatus] ||
      !allowedTransitions[previousStatus].includes(ns)
    ) {
      throw new BadRequestException(
        `Cannot transition order from ${previousStatus} to ${ns}`,
      );
    }

    if (ns === OrderStatus.DISPATCHED) {
      if (!dto.trackingNumber || !dto.courier) {
        throw new BadRequestException(
          'Tracking number and courier are required to switch to DISPATCHED state',
        );
      }
      order.trackingNumber = dto.trackingNumber;
      order.courier = dto.courier;
    }

    order.status = ns;
    await this.workOrderRepository.save(order);

    // Persist to historical trace table
    const historyEntry = this.orderStateHistoryRepository.create({
      order,
      previousStatus,
      newStatus: ns,
      changedByUserId: providerId,
    });

    await this.orderStateHistoryRepository.save(historyEntry);

    return order;
  }
}
