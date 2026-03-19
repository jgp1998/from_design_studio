import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiddingBoardsController } from './bidding-boards.controller';
import { BiddingBoardsService } from './bidding-boards.service';
import { WorkOrder } from '../orders/entities/work-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder])],
  controllers: [BiddingBoardsController],
  providers: [BiddingBoardsService],
})
export class BiddingBoardsModule {}
