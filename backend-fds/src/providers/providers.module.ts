import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { StorageModule } from '../storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderDocument } from '../users/entities/provider-document.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [StorageModule, TypeOrmModule.forFeature([ProviderDocument, User])],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})
export class ProvidersModule {}
