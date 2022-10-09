import { OrderStatusType } from 'src/database/entities/order.entity';

export interface OrderInfo {
  id: string;
  orderId: string;
  totalPrice: number;
  submittedAt: Date;
  numberOfItems: number;
  status: OrderStatusType;
  items: OrderProductInfo[];
}

export interface OrderProductInfo {
  skuId: string;
  quantity: number;
  price: number;
  id: string;
}
