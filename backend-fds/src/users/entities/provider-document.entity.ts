import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { DocumentType } from '../../common/enums/document-type.enum';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Entity('provider_documents')
export class ProviderDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: DocumentType })
  documentType: DocumentType;

  @Column()
  storageObjectKey: string;

  @Column({
    type: 'simple-enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @ManyToOne(() => User, (user: User) => user.documents)
  user: User;
}
