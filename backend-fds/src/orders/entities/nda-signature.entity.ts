import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WorkOrder } from './work-order.entity';

@Entity('nda_signatures')
export class NdaSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.signedNdas)
  provider: User;

  @ManyToOne(() => WorkOrder, (order) => order.ndaSignatures)
  order: WorkOrder;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column({ unique: true })
  hashFingerprint: string;

  @CreateDateColumn()
  timestamp: Date;
}
