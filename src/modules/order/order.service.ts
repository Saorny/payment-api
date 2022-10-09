/* eslint-disable @typescript-eslint/no-this-alias */
import { InjectRepository } from '@nestjs/typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order, OrderStatusType } from '../../database/entities/order.entity';
import { BaseService } from '../common/base-service';
import { Formatter } from './lib/formatter';
import { ProductService } from '../product/product.service';
import { OrderProductService } from './order-product.service';
import { CacheService } from '../cache/cache.service';
import { AuthCustomer } from 'src/auth/data.interface';
import { CustomerService } from '../customer/customer.service';
import { OrderInfo } from './interface/orders.interface';
import { CreateOrderDto, ItemToCheckDto } from './dto/create-order.dto';
import { Customer } from 'src/database/entities/customer';
import { Product } from 'src/database/entities/product.entity';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly orderProductService: OrderProductService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService,
    protected readonly cacheService: CacheService,
  ) {
    super(orderRepository, 'all', 'services/orders', cacheService);
  }

  public async getOrders(user: AuthCustomer): Promise<OrderInfo[] | undefined> {
    const customer = await this.customerService.getCustomerById(
      user.customerId,
      ['orders', 'orders.orderProducts', 'orders.orderProducts.product'],
    );

    if (customer) {
      return Formatter.formatOrderInfoList(customer.orders);
    }
  }

  public retrieveOrder(
    id: string,
    relations?: string[],
  ): Promise<Order | null | undefined> {
    const where = {
      id,
    };

    return this.searchOne(where, relations);
  }

  public async submitOrder(
    user: AuthCustomer,
    info: CreateOrderDto,
  ): Promise<Order | undefined> {
    const skuIds = info.products.map((item: ItemToCheckDto) =>
      item.skuId.toString(),
    );
    const products = await this.productService.getProductsBySkuIds(skuIds);
    const customer = await this.customerService.getCustomerById(
      user.customerId,
    );

    Formatter.checkInventory(info, products);
    if (customer && products) {
      const order = await this.generateOrder(customer, info, products);

      if (order) {
        await this.orderProductService.saveOrderContentList(
          info,
          order,
          products,
        );

        this.logger.log(
          `Customed Submitted Order | Customer ${user.email} | Order ${order.orderId}`,
        );
        await this.productService.decreaseInventory(info.products);
        return order;
      }
    }
  }

  private generateOrder(
    customer: Customer,
    info: CreateOrderDto,
    products: Product[],
  ): Promise<Order | undefined> {
    const order = Formatter.formatNewOrder(customer, info, products);

    return this.save(order);
  }

  public async payForOrder(
    user: AuthCustomer,
    info: PaymentOrderDto,
  ): Promise<any> {
    const customer = await this.customerService.getCustomerById(
      user.customerId,
    );
    const order = await this.searchOne({ orderId: info.orderId }, [
      'orderProducts',
    ]);

    if (customer && order && order.customerId === user.customerId) {
      const payment = await this.paymentService.recordOrderPayment(
        info.method,
        info.transactionCode,
      );
      const updates = {
        status: OrderStatusType.PAID,
        paymentTime: new Date(),
        payment,
      };

      await this.update({ id: order.id }, updates);
    }
  }
}
