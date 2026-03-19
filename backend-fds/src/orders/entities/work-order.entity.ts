import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { WorkOrderFile } from './work-order-file.entity';
import { NdaSignature } from './nda-signature.entity';
import { Bid } from '../../bids/entities/bid.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { OrderStateHistory } from './order-state-history.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.workOrders)
  client: User;

  @Column({
    type: 'simple-enum',
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'int', nullable: true })
  infillPercentage: number;

  @Column({ type: 'float', nullable: true })
  volumeCm3: number;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  courier: string;

  @OneToMany(() => WorkOrderFile, (file: WorkOrderFile) => file.order, {
    cascade: true,
  })
  files: WorkOrderFile[];

  @OneToMany(() => NdaSignature, (nda: NdaSignature) => nda.order, {
    cascade: true,
  })
  ndaSignatures: NdaSignature[];

  @OneToMany(() => Bid, (bid: Bid) => bid.order, { cascade: true })
  bids: Bid[];

  @OneToMany(() => Payment, (payment: Payment) => payment.order, {
    cascade: true,
  })
  payments: Payment[];

  @OneToMany(
    () => OrderStateHistory,
    (history: OrderStateHistory) => history.order,
    { cascade: true },
  )
  stateHistory: OrderStateHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
