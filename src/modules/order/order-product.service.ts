import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderProduct } from '../../database/entities/order-product.entity';
import { BaseService } from '../common/base-service';
import { Order } from '../../database/entities/order.entity';
import { Product } from 'src/database/entities/product.entity';
import { CreateOrderDto, ItemToCheckDto } from './dto/create-order.dto';

@Injectable()
export class OrderProductService extends BaseService<OrderProduct> {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductsRepository: Repository<OrderProduct>,
  ) {
    super(orderProductsRepository, 'link', 'services/orders');
  }

  public saveOrderContentList(
    info: CreateOrderDto,
    order: Order,
    products: Product[],
  ): Promise<any> {
    return Promise.all(
      info.products.map((item: ItemToCheckDto) =>
        this.saveOrderContent(order, item, products),
      ),
    );
  }

  private saveOrderContent(
    order: Order,
    item: ItemToCheckDto,
    products: Product[],
  ): Promise<OrderProduct> | undefined {
    const product = products.find(
      (p: Product) => p.skuId.toString() === item.skuId.toString(),
    );

    if (product) {
      const newOrderProducts = new OrderProduct(
        order.id,
        product.id,
        item.quantity,
        product.price,
      );

      return this.save(newOrderProducts);
    }
  }
}
