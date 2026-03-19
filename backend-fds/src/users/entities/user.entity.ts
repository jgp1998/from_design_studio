import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

import { WorkOrder } from '../../orders/entities/work-order.entity';
import { NdaSignature } from '../../orders/entities/nda-signature.entity';
import { Bid } from '../../bids/entities/bid.entity';
import { Company } from './company.entity';
import { ProviderDocument } from './provider-document.entity';
import { ProviderDetails } from './provider-details.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'simple-enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @Column({
    type: 'simple-enum',
    enum: UserStatus,
    default: UserStatus.PENDING_APPROVAL,
  })
  status: UserStatus;

  @OneToOne(() => Company, (company: Company) => company.user, {
    cascade: true,
  })
  company: Company;

  @OneToOne(() => ProviderDetails, (details: ProviderDetails) => details.user, {
    cascade: true,
  })
  providerDetails: ProviderDetails;

  @OneToMany(
    () => ProviderDocument,
    (document: ProviderDocument) => document.user,
    {
      cascade: true,
    },
  )
  documents: ProviderDocument[];

  @OneToMany(() => WorkOrder, (order: WorkOrder) => order.client, {
    cascade: true,
  })
  workOrders: WorkOrder[];

  @OneToMany(() => NdaSignature, (nda: NdaSignature) => nda.provider, {
    cascade: true,
  })
  signedNdas: NdaSignature[];

  @OneToMany(() => Bid, (bid: Bid) => bid.provider, { cascade: true })
  bids: Bid[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
