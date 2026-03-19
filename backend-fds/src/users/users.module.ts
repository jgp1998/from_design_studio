import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { ProviderDetails } from './entities/provider-details.entity';
import { ProviderDocument } from './entities/provider-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      ProviderDetails,
      ProviderDocument,
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
