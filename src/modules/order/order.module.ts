import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../database/entities/order.entity';
import { ProductModule } from '../product/product.module';
import { OrderProduct } from '../../database/entities/order-product.entity';
import { SharedModule } from '../shared/shared.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderProductService } from './order-product.service';
import { CacheModule } from '../cache/cache.module';
import { CustomerModule } from '../customer/customer.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderProduct]),
    forwardRef(() => ProductModule),
    CacheModule,
    SharedModule,
    CustomerModule,
    PaymentModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProductService],
  exports: [OrderService],
})
export class OrderModule {}
