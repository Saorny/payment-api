import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity.entity';
import { IsUUID } from 'class-validator';
import { Customer } from './customer';

@Entity()
export class FailedOrder extends BaseEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  reason: string;

  @Column({
    nullable: false,
  })
  skuList: string;

  @ManyToOne(() => Customer, (customer) => customer.failedOrders)
  customer: Customer;
}
