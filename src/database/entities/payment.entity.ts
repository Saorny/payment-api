import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './base-entity.entity';
import { IsUUID } from 'class-validator';
import { Order } from './order.entity';

export enum PaymentStatusType {
  AWAITING_CONFIRMATION,
  PAYMENT_SUCCESS,
  PAYMENT_FAILURE,
  DELAY_EXPIRED,
  REFUNDED,
}

@Entity()
export class Payment extends BaseEntity {
  constructor(method: string, paymentCode: string) {
    super();
    this.method = method;
    this.paymentCode = paymentCode;
    this.startFrom = new Date();
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: PaymentStatusType.AWAITING_CONFIRMATION,
  })
  status: number;

  @Column({
    type: 'datetime',
  })
  startFrom: Date;

  @Column({
    type: 'datetime',
  })
  expiredAt: Date;

  @Column({
    nullable: false,
  })
  method: string;

  @Column({
    nullable: false,
  })
  paymentCode: string;

  @Column({
    nullable: true,
  })
  refundId: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  refundAt: Date;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;
}
