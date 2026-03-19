import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('api/v1/orders')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Post(':orderId/bids')
  async create(
    @Request() req: { user: { userId: string } },
    @Param('orderId') orderId: string,
    @Body() dto: CreateBidDto,
  ) {
    return this.bidsService.createBid(req.user.userId, orderId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get(':orderId/bids')
  async findAll(
    @Request() req: { user: { userId: string } },
    @Param('orderId') orderId: string,
  ) {
    return this.bidsService.getBidsForOrder(req.user.userId, orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Patch(':orderId/bids/:bidId/status')
  async acceptBid(
    @Request() req: { user: { userId: string } },
    @Param('orderId') orderId: string,
    @Param('bidId') bidId: string,
  ) {
    await this.bidsService.acceptBid(req.user.userId, orderId, bidId);
    return { ok: true, message: 'Bid accepted and others rejected' };
  }
}
