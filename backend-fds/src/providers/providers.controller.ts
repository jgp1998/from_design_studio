import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { DocumentType } from '../common/enums/document-type.enum';

@Controller('api/v1')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  // Secure endpoints for Provider
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  @Get('providers/documents/presigned-url')
  async getPresignedUrl(
    @Request() req: { user: { userId: string } },
    @Query('filename') filename: string,
    @Query('type') type: DocumentType,
  ) {
    if (!filename || !type) {
      throw new Error('Filename and type are required');
    }
    return this.providersService.getPresignedUrlUpload(
      req.user.userId,
      filename,
      type,
    );
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/providers/:id/status')
  async approveProviderStatus(@Param('id') id: string) {
    return this.providersService.approveProvider(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/providers/:providerId/documents/:documentId')
  async downloadProviderDocument(
    @Param('providerId') providerId: string,
    @Param('documentId') documentId: string,
  ) {
    const url = await this.providersService.getDocumentDownloadUrl(
      providerId,
      documentId,
    );
    return { downloadUrl: url };
  }
}
