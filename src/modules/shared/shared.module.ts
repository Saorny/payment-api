import { Global, Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { QueryService } from './service/query.service';
import { FailedOrderService } from './service/order-failed.service';
import { FailedOrder } from '../../database/entities/failed-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '../cache/cache.module';

@Global()
@Module({
  providers: [ConfigService, QueryService, FailedOrderService],
  exports: [ConfigService, QueryService, FailedOrderService],
  imports: [TypeOrmModule.forFeature([FailedOrder]), CacheModule],
})
export class SharedModule {}
