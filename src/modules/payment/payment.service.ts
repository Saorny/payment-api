import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base-service';
import { CacheService } from '../cache/cache.service';
import { Payment } from 'src/database/entities/payment.entity';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  constructor(
    @InjectRepository(Payment)
    readonly depositRepository: Repository<Payment>,
    readonly cacheService: CacheService,
  ) {
    super(depositRepository, 'all', 'services/deposit-payment', cacheService);
  }

  public async recordOrderPayment(
    method: string,
    code: string,
  ): Promise<Payment> {
    const payment = new Payment(method, code);

    return this.save(payment);
  }
}
