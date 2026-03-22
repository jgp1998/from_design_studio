import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Headers,
  Ip,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDraftDto } from './dto/create-order-draft.dto';
import { UpdateOrderGeometryDto } from './dto/update-order-geometry.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('files/presigned-url')
  async getPresignedUrl(
    @Request() req: { user: { userId: string } },
    @Body('fileName') fileName: string,
    @Body('fileSizeBytes') fileSizeBytes: number,
  ) {
    return this.ordersService.getUploadUrl(
      req.user.userId,
      fileName,
      fileSizeBytes,
    );
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get()
  async getClientOrders(@Request() req: { user: { userId: string } }) {
    return this.ordersService.getClientOrders(req.user.userId);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post()
  async createDraftOrder(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreateOrderDraftDto,
  ) {
    return this.ordersService.createDraftOrder(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Post(':id/nda-signatures')
  async signNda(
    @Request() req: { user: { userId: string } },
    @Param('id') orderId: string,
    @Headers('user-agent') userAgent: string,
    @Headers('x-forwarded-for') xForwardedFor: string,
    @Ip() ip: string,
  ) {
    const realIp = xForwardedFor ? xForwardedFor.split(',')[0] : ip;
    return this.ordersService.signNda(
      req.user.userId,
      orderId,
      realIp,
      userAgent,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Get(':id/files/presigned-download')
  async getCdnDownloadUrl(
    @Request() req: { user: { userId: string } },
    @Param('id') orderId: string,
  ) {
    const url = await this.ordersService.getDownloadUrl(
      req.user.userId,
      orderId,
    );
    return { downloadUrl: url };
  }

  // NOTE: This could be protected by an API Key or specific service role
  // Since it's called by an internal Python worker
  @Patch(':id/geometry')
  async updateOrderGeometry(
    @Param('id') id: string,
    @Body() dto: UpdateOrderGeometryDto,
  ) {
    return this.ordersService.updateGeometry(id, dto.volumeCm3);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Patch(':id/status')
  async updateOrderStatus(
    @Request() req: { user: { userId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(req.user.userId, id, dto);
  }
}
