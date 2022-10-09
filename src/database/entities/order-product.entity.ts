import { BaseEntity } from './base-entity.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderProduct extends BaseEntity {
  constructor(
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
  ) {
    super();
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
    this.orderId = orderId;
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  @Min(1)
  quantity: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;

  @ApiProperty()
  @Column({
    name: 'orderId',
    type: 'uuid',
    nullable: false,
  })
  public orderId: string;

  @ApiProperty()
  @Column({
    name: 'productId',
    type: 'uuid',
    nullable: false,
  })
  public productId: string;

  @ManyToOne(() => Order, (order) => order.orderProducts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;
}
