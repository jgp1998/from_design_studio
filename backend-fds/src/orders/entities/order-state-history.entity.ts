import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { WorkOrder } from '../../orders/entities/work-order.entity';
import { OrderStatus } from '../../common/enums/order-status.enum';

@Entity('order_state_history')
export class OrderStateHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrder, (order: WorkOrder) => order.stateHistory)
  order: WorkOrder;

  @Column({ type: 'simple-enum', enum: OrderStatus })
  previousStatus: OrderStatus;

  @Column({ type: 'simple-enum', enum: OrderStatus })
  newStatus: OrderStatus;

  @Column({ nullable: true })
  changedByUserId: string;

  @CreateDateColumn()
  timestamp: Date;
}
