import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('provider_details')
export class ProviderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  capacityDescription: string;

  @Column({ type: 'int', default: 0 })
  machinesCount: number;

  @Column({ type: 'float', default: 0.0 })
  rating: number;

  @OneToOne(() => User, (user: User) => user.providerDetails)
  @JoinColumn()
  user: User;
}
