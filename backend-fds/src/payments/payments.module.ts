import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { WorkOrder } from '../orders/entities/work-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, WorkOrder])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
