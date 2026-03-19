import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class BiddingBoardsService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
  ) {}

  async getOpenOrders(
    page: number = 1,
    limit: number = 20,
    material?: string,
    minVolume?: number,
  ) {
    const queryBuilder: SelectQueryBuilder<WorkOrder> = this.workOrderRepository
      .createQueryBuilder('order')
      // Note: We intentionally avoid joining or selecting the client name to obfuscate it
      .select([
        'order.id',
        'order.status',
        'order.material',
        'order.color',
        'order.infillPercentage',
        'order.volumeCm3',
        'order.createdAt',
      ])
      .where('order.status = :status', { status: OrderStatus.OPEN });

    if (material) {
      queryBuilder.andWhere('order.material = :material', { material });
    }

    if (minVolume) {
      queryBuilder.andWhere('order.volumeCm3 >= :minVolume', { minVolume });
    }

    // Pagination
    queryBuilder.skip((page - 1) * limit).take(limit);
    queryBuilder.orderBy('order.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
