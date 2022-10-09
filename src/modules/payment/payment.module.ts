import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), CacheModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentModule {}
