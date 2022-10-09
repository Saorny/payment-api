import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { BaseService } from '../../common/base-service';
import { FailedOrder } from '../../../database/entities/failed-order.entity';
import { format, subDays } from 'date-fns';
import { Customer } from '../../../database/entities/customer';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class FailedOrderService extends BaseService<FailedOrder> {
  constructor(
    @InjectRepository(FailedOrder)
    private failedOrderRepository: Repository<FailedOrder>,
  ) {
    super(failedOrderRepository, 'failed', 'services/orders');
  }

  public async addFailedOrder(
    customer: Customer,
    products: Product[],
    reason: string,
  ): Promise<FailedOrder[]> {
    const newFailedOrder = new FailedOrder();

    newFailedOrder.reason = reason;
    newFailedOrder.customer = customer;
    newFailedOrder.skuList = products.reduce((a, b) => {
      return a + b.skuId + ',';
    }, '');
    return this.save(newFailedOrder);
  }

  public async getAllFailedOrders(
    startTime?: string,
    endTime?: string,
  ): Promise<[FailedOrder[], number]> {
    if (!startTime && !endTime) {
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      startTime = yesterday + ' 00:00:00';
      endTime = yesterday + ' 23:59:59';
    } else {
      if (!endTime) {
        endTime = format(new Date(), 'yyyy-MM-dd HH:mm');
      }

      if (!startTime) {
        startTime = format(subDays(new Date(), 3), 'yyyy-MM-dd') + '00:00:00';
      }
    }

    return this.findAndCount({
      where: {
        createdAt: Between(startTime, endTime),
      },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }
}
