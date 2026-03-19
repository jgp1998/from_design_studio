import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';
import { StorageModule } from './storage/storage.module';
import { OrdersModule } from './orders/orders.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BiddingBoardsModule } from './bidding-boards/bidding-boards.module';
import { BidsModule } from './bids/bids.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          return {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            dropSchema: true,
          };
        }
        const url = configService.get<string>('DATABASE_URL');
        
        return {
          type: 'postgres',
          ...(url ? { url } : {
            host: configService.get<string>('POSTGRES_HOST') || 'db',
            port: parseInt(configService.get<string>('POSTGRES_PORT') || '5432', 10),
            username: configService.get<string>('POSTGRES_USER') || 'postgres',
            password: configService.get<string>('POSTGRES_PASSWORD') || 'postgres',
            database: configService.get<string>('POSTGRES_DB') || 'fds_db',
          }),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // DO NOT USE IN PRODUCTION
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProvidersModule,
    StorageModule,
    OrdersModule,
    WebhooksModule,
    BiddingBoardsModule,
    BidsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
