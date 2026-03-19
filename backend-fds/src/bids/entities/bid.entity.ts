import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WorkOrder } from '../../orders/entities/work-order.entity';
import { BidStatus } from '../../common/enums/bid-status.enum';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrder, (order: WorkOrder) => order.bids)
  order: WorkOrder;

  @ManyToOne(() => User, (provider: User) => provider.bids)
  provider: User;

  @Column({ name: 'price_clp', type: 'decimal', precision: 10, scale: 2 })
  bidAmountClp: number;

  @Column({ name: 'estimated_days', type: 'smallint' })
  productionDays: number;

  @Column({ type: 'simple-enum', enum: BidStatus, default: BidStatus.PENDING })
  status: BidStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
