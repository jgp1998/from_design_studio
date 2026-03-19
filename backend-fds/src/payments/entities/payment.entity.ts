import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { WorkOrder } from '../../orders/entities/work-order.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrder, (order: WorkOrder) => order.payments)
  order: WorkOrder;

  @Column({ unique: true, nullable: true })
  gatewayId: string; // Ex. MP Preference ID or Payment ID

  @Column({ name: 'amount_total', type: 'decimal', precision: 10, scale: 2 })
  amountTotalClp: number;

  @Column({ name: 'fds_fee', type: 'decimal', precision: 10, scale: 2 })
  takeRateAmountClp: number;

  @Column({ name: 'provider_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  providerAmountClp: number;

  @Column({
    type: 'simple-enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
