import { UnauthorizedException } from '@nestjs/common';
import { Customer } from 'src/database/entities/customer';
import { OrderProduct } from 'src/database/entities/order-product.entity';
import { Order } from 'src/database/entities/order.entity';
import { Product } from 'src/database/entities/product.entity';
import { OrderErrors } from 'src/errors/order';
import { CreateOrderDto, ItemToCheckDto } from '../dto/create-order.dto';
import { OrderInfo, OrderProductInfo } from '../interface/orders.interface';

export class Formatter {
  public static formatOrderInfoList(orders: Order[]): OrderInfo[] {
    return orders.map((o: Order) => this.formatOrderInfo(o));
  }

  public static formatNewOrder(
    customer: Customer,
    info: CreateOrderDto,
    products: Product[],
  ): Order {
    const orderId = new Date().getTime();
    const order = new Order(
      customer,
      orderId.toString(),
      this.calculateTotalSumOfOrder(info, products),
      info.address,
      this.calculateTotalNumberOfItems(info),
    );

    return order;
  }

  public static checkInventory(
    info: CreateOrderDto,
    products: Product[],
  ): void {
    info.products.map((p: ItemToCheckDto) => {
      const product = products.find(
        (pr: Product) => p.skuId.toString() === pr.skuId.toString(),
      );

      if (product) {
        if (p.quantity > product.quantity) {
          throw new UnauthorizedException(OrderErrors.INVENTORY_NOT_SUFFICIENT);
        }
      } else {
        throw new UnauthorizedException(OrderErrors.ITEM_NOT_FOUND);
      }
    });
  }

  private static calculateTotalSumOfOrder(
    info: CreateOrderDto,
    products: Product[],
  ): number {
    return info.products.reduce((sum: number, i: ItemToCheckDto) => {
      const product = products.find(
        (p: Product) => p.skuId.toString() === i.skuId.toString(),
      );

      if (product) {
        return sum + Number(product.price * i.quantity);
      }
      return sum;
    }, 0);
  }

  private static calculateTotalNumberOfItems(info: CreateOrderDto): number {
    return info.products.reduce((sum: number, i: ItemToCheckDto) => {
      return sum + i.quantity;
    }, 0);
  }

  private static formatOrderInfo(order: Order): OrderInfo {
    return {
      id: order.id,
      orderId: order.orderId,
      totalPrice: order.totalPrice,
      submittedAt: order.submissionTime,
      numberOfItems: order.numberOfItems,
      status: order.status,
      items: order.orderProducts.map((op: OrderProduct) =>
        this.formatOrderProductInfo(op),
      ),
    };
  }

  private static formatOrderProductInfo(link: OrderProduct): OrderProductInfo {
    return {
      skuId: link.product.skuId,
      quantity: link.quantity,
      price: link.price,
      id: link.product.id,
    };
  }
}
