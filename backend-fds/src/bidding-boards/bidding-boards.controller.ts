import {
  Controller,
  Get,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BiddingBoardsService } from './bidding-boards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('api/v1/bidding-boards')
export class BiddingBoardsController {
  constructor(private readonly biddingBoardsService: BiddingBoardsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Get('orders')
  async getOpenOrders(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('material') material?: string,
    @Query('minVolume') minVolumeStr?: string,
  ) {
    const minVolume = minVolumeStr ? parseFloat(minVolumeStr) : undefined;
    return this.biddingBoardsService.getOpenOrders(
      page,
      limit,
      material,
      minVolume,
    );
  }
}
