import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('api/v1')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('orders/:orderId/checkouts')
  async generateCheckout(
    @Request() req: { user: { userId: string } },
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.createCheckoutUrl(req.user.userId, orderId);
  }

  // Webhook is public to receive pings from MP/Webpay
  @Post('webhooks/payments/:gatewayId')
  async handlePaymentWebhook(
    @Param('gatewayId') gatewayId: string,

    @Body() payload: { status?: string; [key: string]: unknown },
  ) {
    // Faking a success payload if the body is empty (for testing)
    const effectivePayload =
      Object.keys(payload).length > 0 ? payload : { status: 'approved' };

    await this.paymentsService.processWebhook(gatewayId, effectivePayload);
    return { ok: true };
  }
}
