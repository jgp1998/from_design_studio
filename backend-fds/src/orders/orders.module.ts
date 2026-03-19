import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { StorageModule } from '../storage/storage.module';
import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderFile } from './entities/work-order-file.entity';
import { NdaSignature } from './entities/nda-signature.entity';
import { OrderStateHistory } from './entities/order-state-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    StorageModule,
    TypeOrmModule.forFeature([
      WorkOrder,
      WorkOrderFile,
      NdaSignature,
      OrderStateHistory,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
