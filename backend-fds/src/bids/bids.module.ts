import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { Bid } from './entities/bid.entity';
import { WorkOrder } from '../orders/entities/work-order.entity';
import { User } from '../users/entities/user.entity';
import { NdaSignature } from '../orders/entities/nda-signature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, WorkOrder, User, NdaSignature])],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
