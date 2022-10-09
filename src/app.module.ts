import { Module } from '@nestjs/common';
import { CacheModule } from './modules/cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './modules/shared/config/config.service';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { SharedModule } from './modules/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './modules/customer/customer.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    CacheModule,
    AuthModule,
    PaymentModule,
    OrderModule,
    ProductModule,
    SharedModule,
    CustomerModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: () => ConfigService.redisConfig,
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [new winston.transports.Console()],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
