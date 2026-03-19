import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('storage-files')
  async handleMinioEvent(
    @Body()
    payload: {
      Records?: Array<{ eventName?: string; s3: { object: { key: string } } }>;
    },
  ) {
    if (payload?.Records) {
      for (const record of payload.Records) {
        if (record.eventName?.startsWith('s3:ObjectCreated:')) {
          const key = record.s3.object.key;
          await this.ordersService.markFileAsUploaded(key);
        }
      }
    }
    return { ok: true };
  }
}
