import { BaseEntity } from './base-entity.entity';
import { Order } from './order.entity';
import { IsString, IsUUID } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { FailedOrder } from './failed-order.entity';

@Entity()
export class Customer extends BaseEntity {
  constructor(name: string, email: string, phoneNumber: string) {
    super();
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @IsString()
  @Column({
    nullable: false,
    length: 32,
  })
  name: string;

  @Index({
    unique: true,
  })
  @IsString()
  @Column({
    nullable: false,
    length: 50,
  })
  email: string;

  @IsString()
  @Column({
    nullable: false,
    length: 600,
  })
  phoneNumber: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => FailedOrder, (failedOrder) => failedOrder.customer)
  failedOrders: FailedOrder[];
}
