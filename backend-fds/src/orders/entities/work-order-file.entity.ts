import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WorkOrder } from './work-order.entity';

@Entity('work_order_files')
export class WorkOrderFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkOrder, (order) => order.files)
  order: WorkOrder;

  @Column()
  storageObjectKey: string;

  @Column()
  fileName: string;

  @Column({ type: 'bigint' })
  fileSizeBytes: number;

  @Column({ default: false })
  isUploaded: boolean;
}
