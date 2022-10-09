import { BaseEntity } from './base-entity.entity';
import { Customer } from './customer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';
import { IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from './payment.entity';

export enum OrderStatusType {
  INITIALIZED,
  AWAITING_PAYMENT,
  PAID,
  SHIPPED,
  DELIVERED,
  CANCELLED,
  REFUNDED,
  ABANDONED,
  AWAITING_LOGISTICS_INFO,
  BEING_CANCELLED,
  BEING_ABANDONED,
  RECEIVED_INVOICE,
}

@Entity()
export class Order extends BaseEntity {
  constructor(
    customer: Customer,
    orderId: string,
    totalPrice: number,
    address: string,
    numberOfItems: number,
  ) {
    super();
    this.customer = customer;
    this.orderId = orderId;
    this.totalPrice = totalPrice;
    this.address = address;
    this.numberOfItems = numberOfItems;
    this.submissionTime = new Date();
    this.status = OrderStatusType.AWAITING_PAYMENT;
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({
    unique: true,
  })
  @Column()
  orderId: string;

  @Index()
  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.INITIALIZED,
  })
  status: OrderStatusType;

  @Column()
  @Min(1)
  numberOfItems: number;

  @Column({
    type: 'datetime',
  })
  submissionTime: Date;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({
    type: 'float',
  })
  totalPrice: number;

  @Column({
    type: 'float',
    default: 0,
  })
  @Min(0)
  freightFee: number;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  paymentTime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  refundTime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  opeTime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  completedTime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  cancelledTime: Date;

  @ApiProperty()
  @Column({
    name: 'customerId',
    type: 'uuid',
    nullable: false,
  })
  public customerId: string;

  @ManyToOne(() => Customer, (consumer) => consumer.orders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts: OrderProduct[];

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  payment: Payment;
}
