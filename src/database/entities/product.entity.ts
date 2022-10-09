import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  BaseEntity,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { IsUUID, Min } from 'class-validator';

@Entity()
export class Product extends BaseEntity {
  constructor(
    skuId: string,
    productName: string,
    price: number,
    description = '',
    quantity = 0,
  ) {
    super();
    this.skuId = skuId;
    this.skuName = productName;
    this.price = price;
    this.description = description;
    this.quantity = quantity;
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({
    unique: true,
  })
  @Column({
    nullable: false,
  })
  skuId: string;

  @Column({
    type: 'float',
    default: 1,
  })
  @Min(0.1)
  price: number;

  @Column({
    nullable: false,
  })
  skuName: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: 0,
    nullable: false,
  })
  @Min(0)
  quantity: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
